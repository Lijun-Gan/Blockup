const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateFriendshipInput = require("../../validation/friendship");

const Friendship = require('../../models/Friendship')

router.post('/new' , (req, res) => {
    const {errors, isValid} = validateFriendshipInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const friendship = new Friendship({
        friend1: req.body.friend1,
        friend2: req.body.friend2
    })

    // friendship.save().then(friendship => res.json(friendship));
    friendship.save().then(friendship =>  {
        Friendship.findById(friendship._id)
        .populate('friend1','username  img_url').populate('friend2','username  img_url')
        .then(friendship => res.json(friendship ))
    } ) 


});

router.get('/:friend_id', (req, res) => {
    // Friendship.find({friend1: req.params.friend_id})
    Friendship.find({$or: [{friend1: req.params.friend_id}, {friend2: req.params.friend_id}]})
        .populate('friend1','username img_url').populate('friend2','username img_url')
        .then(friendships => res.json(friendships))
        .catch(err =>
            res.status(404).json({ noFriendshipfound: 'No friendships found from this user' }
        )
    );
});

router.delete("/delete/:id", (req, res) => {
    Friendship.findByIdAndRemove(req.params.id)
      .then((friendship) => {
          return res.json(friendship )
        // res.json({successDelete: "Success Delete"}) 
      })
  });

  module.exports = router;

//6065203ad7c1173fb7eab396
//60651f80d7c1173fb7eab395