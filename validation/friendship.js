const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateMessageInput(data) {

    let errors = {};

    data.friend1 = validText(data.friend1) ? data.friend1 : '';
    data.friend2 = validText(data.friend2) ? data.friend2 : '';


    if (Validator.isEmpty(data.friend1)) {
        errors.text = 'friend1 field is required';
    }
    if (Validator.isEmpty(data.friend2)) {
        errors.text = 'friend2 field is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
} 