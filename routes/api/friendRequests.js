const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateFriendRequestInput = require('../../validation/friendRequest');

const FriendRequest = require('../../models/FriendRequest');
const User = require('../../models/User');

router.post('/new' , (req, res) => {
    const {errors, isValid} = validateFriendRequestInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.find({_id: req.body.receiverId}, (err, docs)=>{
        if (docs.length > 0){
            console.log("docs.length",docs)
            const friendRequest = new FriendRequest({
                senderId: req.body.senderId,
                receiverId: req.body.receiverId
            })
        
            // friendRequest.save().then(friendRequest => res.json(friendRequest))
            friendRequest.save().then(friendRequest =>  {
                FriendRequest.findById(friendRequest._id)
                .populate('senderId','username img_url').populate('receiverId','username img_url')
                .then(friendRequest => {
                    res.json(friendRequest)
                })
            }) 
        }else{
            console.log("err: ",docs)
            return  res.status(404).json({ idCannotfound: 'Entered id cannot be found' })
        }
    })

    // const friendRequest = new FriendRequest({
    //     senderId: req.body.senderId,
    //     receiverId: req.body.receiverId
    // })

    // // friendRequest.save().then(friendRequest => res.json(friendRequest))
    // friendRequest.save().then(friendRequest =>  {
    //     FriendRequest.findById(friendRequest._id)
    //     .populate('senderId','username').populate('receiverId','username')
    //     .then(friendRequest => {
    //         res.json(friendRequest)
    //     })
    // }) 
}); 

router.get('/:friend_id', (req, res) => {
    // Friendship.find({friend1: req.params.friend_id})
    FriendRequest.find({$or: [{senderId: req.params.friend_id}, {receiverId: req.params.friend_id}]})
        .populate('senderId','username img_url').populate('receiverId','username img_url')
        .then(friendRequests => res.json(friendRequests))
        // .catch(err =>
        //     res.status(404).json({ noFriendRequestfound: 'No friendRequest found from this user' }
        // )
    // );
});


router.delete("/delete/:id", (req, res) => {
    FriendRequest.findByIdAndRemove(req.params.id)
    .then((friendRequest) => {
        return res.json(friendRequest)
        // res.json({successDelete: "Success Delete"}) 
    })
});





module.exports = router;