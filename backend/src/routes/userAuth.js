const express = require('express');

const authRouter = express.Router();
const { register, login, logout, adminRegister, deleteProfile, updateProfile } = require('../controllers/userAuthent');
const { generateImageUploadSignature } = require('../controllers/videoSection');
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController'); // ✅ Import OTP
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// ✅ OTP Routes
authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/resend-otp', resendOTP);

// Profile
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.put('/update-profile', userMiddleware, updateProfile);

// Image upload signature
authRouter.get('/image-upload-signature', userMiddleware, generateImageUploadSignature);

// Check Auth
authRouter.get('/check', userMiddleware, (req, res) => {
    const user = req.result.toObject();
    delete user.password;
    res.status(200).json({
        user: user,
        message: "Valid User"
    });
});

module.exports = authRouter;