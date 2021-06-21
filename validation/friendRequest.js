const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateMessageInput(data) {

    let errors = {};

    data.senderId = validText(data.senderId) ? data.senderId : '';
    data.receiverId = validText(data.receiverId) ? data.receiverId : '';


    if (Validator.isEmpty(data.senderId)) {
        errors.text = 'senderId field is required';
    }
    if (Validator.isEmpty(data.receiverId)) {
        errors.text = 'receiverId field is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
} 