const nodemailer = require('nodemailer');

// ✅ Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Send OTP Email Function
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔐 LeetCode Clone - Email Verification OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2563eb; text-align: center;">🔐 Email Verification</h2>
                <p style="text-align: center; font-size: 16px;">Thank you for signing up! Please use the OTP below to verify your email address.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otp}</span>
                </div>
                <p style="text-align: center; font-size: 14px; color: #6b7280;">This OTP is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                <p style="text-align: center; font-size: 12px; color: #9ca3af;">LeetCode Clone | Built with ❤️</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

module.exports = { sendOTPEmail };