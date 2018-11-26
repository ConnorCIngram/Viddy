const express = require('express');
const router = express.Router();
const User = require('../../models/User/UserScema');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useCreateIndex: true});

// authenticate user from email and password, return auth token if valid
router.post('/', function(req, res) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send("Server error");
    if (!user) return res.status(404).send("User Not Found");

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).send({auth: false, token: null});
      const token = jwt.sign({id: user._id}, process.env.authTokenKey, {expiresIn: '24h'});

      return res.status(200).send({auth: true, token: token});
    });
  });
});

// get a user from the request token header
router.get('/', verifyToken, function(req, res, next) {
  User.findById(req.userId, {password: 0}, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
      res.status(200).send(user);
  });
});

// Create and save new user, return auth token if valid
router.post('/register', function(req, res, next) {
  console.log(req.body);
  User.create(req.body, (err, user) => {
      if (err) {
          if (err.code === 11000) {
              // MongoError, duplicate key
              res.status(409).send('Email already in use');
          } else {
              next(err);
          }
      }
      // create token
      const token = jwt.sign({id: user._id}, 
                             process.env.authTokenKey, 
                             {expiresIn: '24h'});
      res.status(200).json({ auth: true, token: token });
  });
});

module.exports = router;