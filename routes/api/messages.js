const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Room = require("./../../models/Room");

const Message = require("./../../models/Message");
const validateMessageInput = require("./../../validation/message");

router.get("/:id", (req, res) => {
  Message.findById(req.params.id)
    .populate("author", "username")
    .then((message) => res.json(message))
    .catch((err) =>
      res.status(404).json({ nomessagefound: "No message found with that ID" })
    );
});

router.get("/room/:room_id", (req, res) => {
  Message.find({ room: req.params.room_id })
    .populate("author", "username")
    .then((messages) => res.json(messages))
    .catch((err) =>
      res
        .status(404)
        .json({ nomessagesfound: "No messages found from that room" })
    );
});

router.post(
  "/new",
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateMessageInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const socket = req.app.locals.socket;

    const newMessage = new Message({
      content: req.body.content,
      author: req.body.author,
      room: req.body.room,
    });

    newMessage.save().then(function (result) {
      Room.findOneAndUpdate(
        { _id: req.body.room },
        { $push: { messages: result._id } }
        , {new: true, useFindAndModify: false}
        ,(error, success)=>{
            if(error){
              console.log(error,"not append message...............");
            }else{
              console.log(success.messages.slice(-1),"appended message...............")
            }
          }
      )

      Message.find({ _id: result._id })
        .populate("author", "username")
        .then((message) => {
          
          // socket.to(req.body.room).emit("incoming message", message[0]);
          
          console.log(message[0]);
          res.json(message[0]);
        });
        
    });
  }
);

module.exports = router;
