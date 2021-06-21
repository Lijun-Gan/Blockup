const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        img_url: {
            type: String,
        },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message'}]
    },
    {
        timestamps: true,
    }
)

module.exports = Room = mongoose.model("Room", RoomSchema)