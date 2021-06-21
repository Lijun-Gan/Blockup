const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User");
const keys = require("../../config/keys");

const Friendship = require('../../models/Friendship');
const FriendRequest = require('../../models/FriendRequest');
const Message = require("./../../models/Message");


const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const multer = require('multer')
const path = require("path");

// const fs = require("fs")

const AWS = require('aws-sdk')
const uuid = require('uuid')
const dotenv = require('dotenv')

dotenv.config()

// const region =  process.env.AWS_REGION
// const accessKeyId= process.env.AWS_ACCESS_KEY_ID
// const secretAccessKey= process.env.AWS_SECRET_ACCESS_KEY

AWS.config.update({
  
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  
})
const s3 = new AWS.S3();

const storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '')
  }
})

const upload = multer({storage}).single("file")

// const storage = multer.diskStorage({
//   // destination: "./frontend/public",
//   destination: "./frontend/public/images",
//   // destination: "./images",
//   filename: function(req, file, cb){
//      cb(null, Date.now() + '-' + req.headers.userid + ".png");
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 5000000},
// }).single("file");


// router.patch("/upload", (req, res) => {
  router.patch("/upload", upload, (req, res) => {

  // if(req.headers.original !== "default-user.png"){

  //   // if (fs.existsSync("./frontend/public/images/" + req.headers.userid + ".png") ){
  //   //   fs.unlinkSync("./frontend/public/images/" + req.headers.userid + ".png");
  //   if (fs.existsSync("./frontend/public/images/" + req.headers.original) ){
  //     fs.unlinkSync("./frontend/public/images/" + req.headers.original);
  //     console.log(req.headers.original,"     exist.........")
  //   }else{
  //     console.log("./frontend/public/images/" + req.headers.original +  "  no.........")
      
  //   }
  
      
  //   // fs.unlinkSync("./frontend/public/images/" + req.headers.original);

  // }

  let myFile = req.file.originalname.split(".")
  const fileType = myFile[myFile.length - 1]


  const params = {
      ContentType: req.file.mimetype, 
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET_NAME,
      // Key: `${uuid()}.${fileType}`,
      Key: req.headers.username + `-${uuid.v4()}.${fileType}`,
      Body: req.file.buffer
  }

    console.log("$$$$$$",req.headers.username + `-${uuid.v4()}.${fileType}`, myFile,fileType,"$$$$$$")
    // upload(req, res, (err) => {
      // console.log("Request ---", req.body);
      // console.log("Request file ---", req.file);

      s3.upload(params, (error, data) => {

      if (error) {
        console.log("***********",error,"************")
      }
  
      console.log(data.Location)
      // User.findOneAndUpdate({_id: req.headers.userid},{$set:{img_url: req.file.filename}}, {new: true, useFindAndModify: false },
      User.findOneAndUpdate({_id: req.headers.userid},{$set:{img_url: data.Location}}, {new: true, useFindAndModify: false },
        // (err)=>{if(!err) {return res.json({status:"success",message:"username updated"});}}
      )
      .then((result) => {
        // console.log("@@@@@@@",result,"@@@@@@@")
  
  
        // console.log(req.headers.username,req.headers.verified,req.headers.otpauth_url)
  
        const payload = {
          id: req.headers.userid,
          username: req.headers.username,
          verified: req.headers.verified,
          // img_url: req.file.filename,
          img_url: result.img_url,
          otpauth_url: req.headers.otpauth_url,
        };

        // console.log("@@@@@@@",payload,"@@@@@@@")
  
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
  
        // res.json(result);
      })
  
  
    });




});

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Success" });
  }
);

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ email: "A user has already registered with this address" });
    } else {
      const auth_token = speakeasy.generateSecret({
        name: "Blockup",
      });
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        img_url: "default-user.png",
        password: req.body.password,
        secret: auth_token.base32,
        otpauth_url: auth_token.otpauth_url,
      });

      console.log(newUser);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = { id: user.id, username: user.username };
              // console.log(user);

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


              const newRoom1 = new Room({
                name: "Blockup Assistant & " + user.username,
                img_url: req.body.img_url || "",
                members: [{_id:"60cb115466cf4d1910ea63f4"}, {_id: user._id}],
                messages: [], 
              });
            
              const messsage = `Hi ${user.username}. Welcome to Blockup! We are delighted you signed up. Please let me know if you have any questions. I am always happy to help 😃. Also, feel free to talk with our developers in the group chat. Thanks, Blockup Assistant.`

              newRoom1.save().then((result=>{
                const newMessage = new Message({
                  content: messsage,
                  author: user._id,
                  room: result._id,
                });
            
                newMessage.save().then((message)=>{
                  newUser.password = hash;
                  newRoom1.messages.push(message._id)
                  newRoom1.save()
                })
              }))


              const friendship = new Friendship({
                friend1: "60cb115466cf4d1910ea63f4",
                friend2: user._id
              })

              friendship.save()
              
              const friendRequest1 = new FriendRequest({
                senderId: "60cfeda9e1efbc32140e72be",
                receiverId: user._id
              })
              
              friendRequest1.save()

              const friendRequest2 = new FriendRequest({
                senderId: user._id,
                receiverId: "60cfef948136ea3269c1c145"
              })
              
              friendRequest2.save()

              const newRoom2 = new Room({
                name: "Blockup Developers & " + user.username,
                img_url: req.body.img_url || "",
                members: [{_id:"60cb133a840441193f6d4f1d"}, {_id:"60cfee7fa6f4473225f4412e"}, {_id:"60cfeecba6f4473225f44132"}, {_id:"60cfeefda6f4473225f44136"}, {_id:user._id}],
                messages: [], 
              });
            
              newRoom2.save()
       
              res.json({ user });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username,
          verified: user.verified,
          img_url:  user.img_url,
          otpauth_url: user.otpauth_url,
        };

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
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    });
  });
});

router.patch("/verifyTwoFA", (req, res) => {
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
      //res.json(user);
      res.status(400).json({ message: "Token does not match" });
      //create error for errors reducer
      //res.json({ user });
    }
  });
});

module.exports = router;
