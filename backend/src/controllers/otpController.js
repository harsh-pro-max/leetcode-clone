const User = require("../models/user");
const redisClient = require("../config/redis");
const { sendOTPEmail } = require("../config/nodemailer");
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

// ✅ Generate OTP (6-digit, secure)
const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
        avoidSimilarChars: true
    });
};

// ✅ Send OTP
const sendOTP = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if user already verified
        const user = await User.findOne({ emailId });
        if (user && user.emailVerified) {
            return res.status(400).json({ error: "Email already verified. Please login." });
        }

        // Generate OTP and store in Redis
        const otp = generateOTP();
        const otpKey = `otp:${emailId}`;
        await redisClient.set(otpKey, otp, 'EX', 300); // 5 minutes

        // Send email
        await sendOTPEmail(emailId, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email"
        });

    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};

// ✅ Verify OTP - Handles BOTH new users AND existing unverified users
const verifyOTP = async (req, res) => {
    try {
        const { emailId, otp } = req.body;

        if (!emailId || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // ✅ Check OTP from Redis
        const otpKey = `otp:${emailId}`;
        const storedOTP = await redisClient.get(otpKey);
        if (!storedOTP) {
            return res.status(400).json({ error: "OTP expired or invalid. Please request a new one." });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // ✅ Check if user already exists in database
        const existingUser = await User.findOne({ emailId });

        let user;

        if (existingUser) {
            // ✅ Case 1: User already exists → Just verify email
            if (existingUser.emailVerified) {
                return res.status(400).json({ error: "Email already verified. Please login." });
            }

            existingUser.emailVerified = true;
            existingUser.otp = null;
            existingUser.otpExpiry = null;
            await existingUser.save();
            user = existingUser;

            // Clean up Redis OTP
            await redisClient.del(otpKey);

        } else {
            // ✅ Case 2: New user → Get temp data from Redis
            const tempUserKey = `temp_user:${emailId}`;
            const tempUserData = await redisClient.get(tempUserKey);
            if (!tempUserData) {
                return res.status(400).json({ error: "Registration data expired. Please register again." });
            }

            const userData = JSON.parse(tempUserData);

            // Create new user in database
            user = await User.create({
                firstName: userData.firstName,
                emailId: userData.emailId,
                password: userData.password,
                role: userData.role || 'user',
                emailVerified: true
            });

            // Clean up Redis
            await redisClient.del(tempUserKey);
            await redisClient.del(otpKey);
        }

        // ✅ Generate JWT token for the user
        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

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

        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(200).json({
            success: true,
            user: reply,
            message: "Email verified successfully! You are now logged in."
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already registered. Please login." });
        }
        res.status(500).json({ error: "Failed to verify OTP" });
    }
};

// ✅ Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if user already verified
        const user = await User.findOne({ emailId });
        if (user && user.emailVerified) {
            return res.status(400).json({ error: "Email already verified. Please login." });
        }

        // Generate new OTP and store in Redis
        const otp = generateOTP();
        const otpKey = `otp:${emailId}`;
        await redisClient.set(otpKey, otp, 'EX', 300); // 5 minutes

        // Resend email
        await sendOTPEmail(emailId, otp);

        res.status(200).json({
            success: true,
            message: "OTP resent successfully to your email"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ error: "Failed to resend OTP" });
    }
};

module.exports = { sendOTP, verifyOTP, resendOTP };