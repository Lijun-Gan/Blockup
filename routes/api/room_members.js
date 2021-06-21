const express = require("express");
const router = express.Router();
const RoomMember = require("../../models/Room_member");
const mongoose = require('mongoose');
const passport = require("passport");
const { json } = require("body-parser");

router.get('/rooms', (req, res) => {
    RoomMember.find({member_id: req.params.user_id})
        // .sort({ date: -1 })
        .then(userRooms => res.json(userRooms))
        .catch(err =>
            res.status(404).json({ noroomsfound: 'No rooms found from this user' }
        )
    );
});
 // all the rooms of userx

router.get('/members', (req, res) => {
    RoomMember.find({room_id: req.params.id})
    .then(members => res.json(members))
    .catch(err => 
        res.status(404).json({ nomembersFound: 'Looks like you have not made any members'})
    )
})
//get the members of a room

module.exports = router;