const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({

    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }, 
    status: {
        type: String,
        default: "Pending"
    }},{
        timestamps: true,
    }

  );

  module.exports = FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);