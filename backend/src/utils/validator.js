const validator = require('validator');

const validate = (data) => {
    const mandatoryField = ['firstName', 'emailId', 'password'];

    const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

    if (!IsAllowed) {
        throw new Error('Some Field Missing');
    }

    if (!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if (!validator.isStrongPassword(data.password))
        throw new Error("Week Password");

    // ✅ NEW: Phone number validation (if provided)
    if (data.phoneNumber && !validator.isMobilePhone(data.phoneNumber, 'any', { strictMode: false })) {
        throw new Error("Invalid phone number format");
    }

    // ✅ NEW: Profile image URL validation (if provided)
    if (data.profileImage && !validator.isURL(data.profileImage, {
        protocols: ['http', 'https'],
        require_protocol: true
    })) {
        throw new Error("Invalid profile image URL");
    }
};

module.exports = validate;