const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const verifyToken = require('../Auth/VerifyToken');

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const User = require('../../models/User/UserScema');
const mongoose = require('mongoose');

require('dotenv').config()

router.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useCreateIndex: true});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 256, height: 256, crop: "fill", gravity: "north_west" }]
});

const parser = multer({ storage: storage });

const DefaultPublicId = 'demo/emgxr4tcseh4i38eulxa';

router.post('/', verifyToken, parser.single("image"), (req, res) => {
  // find and update user with image url
  User.findOneAndUpdate({_id: req.userId}, {profilePicURL: req.file.url}, (err, user) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (user) {
      if (user.profilePicURL) {
        // remove the previous profile pic from the database
        let public_id = 'demo/' + user.profilePicURL.split('/demo/')[1].split('.')[0];
        if (public_id !== DefaultPublicId) {
          cloudinary.v2.uploader.destroy(public_id, (err, result) => {
            console.log(err, result);
            if (err) return res.sendStatus(500);
            else return res.status(200).send({profilePicURL: req.file.url});
          });
        } else {
          console.log('IS DEFAULT PROFILE PIC');
          return res.sendStatus(204);
        }
      }
      else return res.status(200).send({profilePicURL: req.file.url});
    } else return res.sendStatus(500);
  })
});

router.delete('/', verifyToken, (req, res) => {
  User.findOneAndUpdate({_id: req.userId}, {profilePicURL: 'https://res.cloudinary.com/dtzkyayik/image/upload/v1544860880/demo/emgxr4tcseh4i38eulxa.png'}, (err, user) => {
    if (err) return res.status(500).send("Something went wrong");
    if (user.profilePicURL) {
      let public_id = 'demo/' + user.profilePicURL.split('/demo/')[1].split('.')[0];
      if (public_id !== DefaultPublicId) {
        cloudinary.v2.uploader.destroy(public_id, (err, result) => {
          console.log(err, result);
          if (err) return res.sendStatus(500);
          else return res.status(200).send("Deleted Successfully!");
        });
      } else {
        console.log("IS DEFAULT PROFILE PIC");
        return res.sendStatus(204);
      }
    } else return res.status(404).send("Cannot remove.");
  });
});

module.exports = router;