const express = require('express');
const router = express.Router();
const User = require('../models/User/UserScema');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/test');

router.use(bodyParser.json());

// get all users
router.get('/', function(req, res, next) {
    User.find({}, (err, users) => {
        if (err) next(err);
        res.json(users);
    })
});

// get one user by id
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, (err, user) => {
        if (err) next(err);
        res.send(user);
    });
});

// save user 
router.post('/', function(req, res, next) {
    console.log('SAVING USER...');
    console.log(req.body);
    User.create(req.body, (err, user) => {
        if (err) {
            if (err.code === 11000) {
                // MongoError, duplicate key
                console.log('DUPLICATE EMAIL');
                res.send('Email already in use');
            } else {
                next(err);
            }
        }
        console.log(user);
        res.json(user);
    });
});

module.exports = router;