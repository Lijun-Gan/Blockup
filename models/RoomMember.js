const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomMemberSchema = new Schema (
    {
       room:{
        type: Schema.Types.ObjectId,
        ref : 'Room'
       },
       member: {
        type: Schema.Types.ObjectId,
        ref : 'User'
       }
    },
    {
        timestamps: true,
    }
);

module.exports = RoomMember = mongoose.model("RoomMember", RoomMemberSchema)