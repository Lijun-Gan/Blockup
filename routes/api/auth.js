const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const speakeasy = require("speakeasy");

const User = require("../../models/User");

router.patch(
  "/verifyTwoFA",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token = req.body.token;
    const userId = req.body.userId;
    User.findOne({ _id: userId }).then((user) => {
      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: "base32",
        token,
      });

      if (verified) {
        user.verified = true;
        user.save().then((user) => res.json(user));
      } else {
        console.log("Token does not match");
        console.log(user);
        //console.log("auth");
        console.log(res.json(user));
        res.status(400).json({ message: "Token does not match" });
        //create error for errors reducer
      }
    });
  }
);

module.exports = router;
