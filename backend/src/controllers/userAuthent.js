const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require("../config/nodemailer");
const otpGenerator = require('otp-generator');

// ✅ Generate OTP function (6-digit, secure)
const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
        avoidSimilarChars: true
    });
};

const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        // ✅ Check if user already exists in DB
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered. Please login." });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Store user data temporarily in Redis (TTL: 10 minutes)
        const tempUserKey = `temp_user:${emailId}`;
        await redisClient.set(tempUserKey, JSON.stringify({
            firstName,
            emailId,
            password: hashedPassword,
            role: 'user'
        }), 'EX', 600); // 10 minutes expiry

        // ✅ Generate and store OTP in Redis (TTL: 5 minutes)
        const otp = generateOTP();
        const otpKey = `otp:${emailId}`;
        await redisClient.set(otpKey, otp, 'EX', 300); // 5 minutes expiry

        // ✅ Send OTP email
        await sendOTPEmail(emailId, otp);

        res.status(201).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete registration.",
            emailId: emailId
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({ emailId });
        if (!user) throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid Credentials");

        // ✅ Check if email is verified
        if (!user.emailVerified) {
            // ✅ Generate new OTP
            const otp = generateOTP();
            const otpKey = `otp:${emailId}`;
            await redisClient.set(otpKey, otp, 'EX', 300); // 5 minutes expiry

            // ✅ Send OTP email
            await sendOTPEmail(emailId, otp);

            // ✅ Return action flag so frontend redirects to OTP page
            return res.status(401).json({
                error: "Email not verified. A new OTP has been sent to your email.",
                action: "VERIFY_OTP",
                emailId: emailId
            });
        }

        // ✅ Verified user → Login successful
        const reply = {
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            age: user.age,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
            problemSolved: user.problemSolved || [],
            createdAt: user.createdAt,
            emailVerified: user.emailVerified
        };

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // ✅ COOKIE FIX: Secure + SameSite none
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json({
            user: reply,
            message: "Logged In Successfully"
        });

    } catch (err) {
        res.status(401).json({ error: err.message || "Invalid Credentials" });
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // ✅ COOKIE CLEAR FIX: Use clearCookie with secure + sameSite
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.send("Logged Out Successfully");
    } catch (err) {
        res.status(503).send("Error: " + err);
    }
};

const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // ✅ COOKIE FIX: Secure + SameSite none
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(201).send("Admin Registered Successfully");
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
};

// ✅ UPGRADED: Delete Profile with Cascade Delete
const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ COOKIE CLEAR FIX: Use clearCookie with secure + sameSite
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json({
            success: true,
            message: "Account deleted successfully. All submissions removed."
        });

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ UPGRADED: Update Profile (Now supports Phone & Image)
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, age, phoneNumber, profileImage } = req.body;
        const userId = req.result._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (age !== undefined) user.age = age;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (profileImage !== undefined) user.profileImage = profileImage;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (err) {
        console.error("Update profile error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ error: "Phone number already in use by another account" });
        }
        res.status(500).json({ error: "Failed to update profile" });
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile, updateProfile };