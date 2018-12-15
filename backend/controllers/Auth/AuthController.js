const express = require('express');
const router = express.Router();
const User = require('../../models/User/UserScema');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verifyToken = require('./VerifyToken');
const qs = require('qs');

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

// updates a user
router.put('/', verifyToken, function(req, res) {
  User.findByIdAndUpdate(req.userId, qs.parse(req.body), function(err, user) {
    console.log(err, user);
    if (err) res.sendStatus(204);
    if (user) {
      res.sendStatus(200);
    } else res.sendStatus(404);
  });
});

router.put('/password', verifyToken, function(req, res) {
  console.log(req.body);
  User.findById(req.userId, (err, user) => {
    console.log(err, user);
    if (err) return res.sendStatus(404).end();
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(err, isMatch);
      if (err) return res.sendStatus(500).end();
      if (!isMatch) return res.sendStatus(401).end();
      // password matched, update user with new password
      user.password = req.body.newPassword;
      user.save((err) => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(200);
      });
    });
  })
});

// get a user from the request token header
router.get('/', verifyToken, function(req, res, next) {
  User.findById(req.userId, {password: 0}, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
      res.status(200).send(user);
      next();
  });
});

// Create and save new user, return auth token if valid
router.post('/register', function(req, res, next) {
  console.log(req.body);
  console.log(req.body['name[firstname]']);
  if (req.body['name[firstname]']) {
    user = {
      email: req.body.email,
      password: req.body.password,
      name: {
        firstname: req.body['name[firstname]'],
        lastname: req.body['name[lastname]']
      }
    }
  } else user = req.body;
  User.create(user, (err, user) => {
      if (err) {
          if (err.code === 11000) {
              // MongoError, duplicate key
              return res.status(409).send('Email already in use');
              
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