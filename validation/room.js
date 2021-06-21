const Validator = require("validator");
const validText = require("./valid-text");


module.exports = function validateRoomNameInput(data) {
    let errors = {};
    // data.img_url = data.img_url || make a default image
    data.name = validText(data.name) ? data.name : "";

    if (Validator.isEmpty(data.name)){
        errors.name = "Room name must have valid characters";
    }
    // if (!(Validator.isLength(data.name, {min: 3, max:30 }))){
    //     errors.name = "Room name must include at least 3 characters";
    // }

    return {
        errors, 
        isValid: Object.keys(errors).length === 0
    }
}