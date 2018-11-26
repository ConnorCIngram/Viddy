const express = require('express');
const router = express.Router();
const User = require('../models/User/UserScema');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useCreateIndex: true});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get one user by id
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, (err, user) => {
        if (err) next(err);
        res.send(user);
    });
});

module.exports = router;