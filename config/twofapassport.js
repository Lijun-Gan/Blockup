const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleAuthenticator = require("passport-2fa-totp").GoogeAuthenticator;
const TwoFAStartegy = require("passport-2fa-totp").Strategy;
const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const passport = require("passport");
const User = require("../models/User");
const keys = require("../config/keys");

module.exports = function (passport) {
  var INVALID_LOGIN = "Invalid username or password";

  passport.serializeUser(function (user, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne(new ObjectID(id), function (err, user) {
      if (err) {
        return done(err);
      } else if (user === null) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    });
  });

  passport.use(
    "login",
    new TwoFAStartegy(
      {
        email: "email",
        password: "password",
        codeField: "code",
      },
      function (email, password, done) {
        // 1st step verification: username and password

        process.nextTick(function () {
          User.findOne({ email: email }, function (err, user) {
            if (err) {
              return done(err);
            }

            if (user === null) {
              return done(null, false, { message: INVALID_LOGIN });
            }

            bcrypt.compare(password, user.password, function (err, result) {
              if (err) {
                return done(err);
              }

              if (result === true) {
                return done(null, user);
              } else {
                return done(null, false, { message: INVALID_LOGIN });
              }
            });
          });
        });
      },
      function (user, done) {
        // 2nd step verification: TOTP code from Google Authenticator

        if (!user.verified) {
          done(new Error("Google Authenticator is not setup yet."));
        } else {
          // Google Authenticator uses 30 seconds key period
          // https://github.com/google/google-authenticator/wiki/Key-Uri-Format

          var secret = GoogleAuthenticator.decodeSecret(user.secret);
          done(null, secret, 30);
        }
      }
    )
  );

  passport.use(
    "register",
    new TwoFAStartegy(
      {
        email: "email",
        password: "password",
        passReqToCallback: true,
        skipTotpVerification: true,
      },
      function (req, email, password, done) {
        // 1st step verification: validate input and create new user

        if (!/^[A-Za-z0-9_]+$/g.test(req.body.email)) {
          return done(null, false, { message: "Invalid email" });
        }

        if (req.body.password.length === 0) {
          return done(null, false, { message: "Password is required" });
        }

        if (req.body.password !== req.body.confirmPassword) {
          return done(null, false, { message: "Passwords do not match" });
        }

        User.findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }

          if (user !== null) {
            return done(null, false, { message: "Invalid email" });
          }
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            secret: auth_token.base32,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  const payload = { id: user.id, username: user.username };

                  jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                      res.json({
                        success: true,
                        token: "Bearer" + token,
                      });
                    }
                  );
                  res.json({
                    user,
                    qrcode: user_qrcode,
                    message: "User created",
                  });
                })
                .catch((err) => console.log(err));
            });
          });
        });
      }
    )
  );
};
