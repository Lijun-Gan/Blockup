const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({

    friend1: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    friend2: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }}, {
        timestamps: true,
    }
  );

  module.exports = Friendship = mongoose.model("Friendship", FriendshipSchema);