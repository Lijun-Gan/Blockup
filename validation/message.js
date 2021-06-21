const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateMessageInput(data) {
    let errors = {};

    data.content = validText(data.content) ? data.content : '';

    if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
        errors.text = 'Message must be between 1 and 300 characters';
    }

    if (Validator.isEmpty(data.content)) {
        errors.text = 'Message field is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
}