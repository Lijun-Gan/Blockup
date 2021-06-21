const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: {
      type: String,
      required: true
    },
    room: {
     type: Schema.Types.ObjectId,
     ref: 'Room'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
        timestamps: true,
    }
  );

  module.exports = Message = mongoose.model("Message", MessageSchema);
