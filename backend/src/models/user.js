const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    // ✅ NEW: Phone Number
    phoneNumber: {
        type: String,
        sparse: true,
        unique: true,
        match: [/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits only'],
        validate: {
            validator: function(v) {
                return v === null || v === '' || /^[0-9]{10,15}$/.test(v);
            },
            message: 'Phone number must be 10-15 digits only'
        }
    },
    // ✅ NEW: Profile Image
    profileImage: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff|ico|avif|heic|heif)/i.test(v);
            },
            message: 'Invalid profile image URL format'
        }
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem',
            unique: true
        }],
    },
    password: {
        type: String,
        required: true
    },

    // ✅ NEW OTP FIELDS
    emailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    }

}, {
    timestamps: true
});

// ✅ CASCADE DELETE
userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({ userId: userInfo._id });
        await mongoose.model('solutionVideo').deleteMany({ userId: userInfo._id });
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;