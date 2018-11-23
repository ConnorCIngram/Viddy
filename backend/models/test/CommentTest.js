const mongoose = require('mongoose'),
      Comment = require('../Comment/CommentSchema'),
      User = require('../User/UserScema'),
      Video = require('../Video/VideoSchema'),
      Utils = require('../Utils/Utils'),
      expect = require('chai').expect,
      assert = require('chai').assert,
      async = require('async');

describe('Comment', function() {
    before(function(done) {
        // open test database connection
        mongoose.connect('mongodb://localhost:27017/test', 
        { 
            useNewUrlParser: true, 
            useFindAndModify: false,
            useCreateIndex: true 
        }, done);
    });
    var userId,
        videoID,
        commentID;
    it('should save with a valid user and video', function(done) {
        let u = new User({
            name: {firstname: 'Krystal', lastname: 'White'},
            email: 'kwhite@isthisreallife.com',
            password: 'WhatIsThis?'
        });
        u.save((err, user) => {
            userID = user._id;
            let v = new Video({
                title: 'How to get a better sense of pride and accomplishment',
                author: user._id
            });
            v.save((err, vid) => {
                videoID = vid._id;
                let c = new Comment({
                    from_user: user._id,
                    on_video: vid._id,
                    body: 'Is this fake news?'
                });
                c.save((err, comment) => {
                    commentID = comment._id;
                    done();
                });
            });
        });
    });

    it ('should update user and video on comment deletion', function(done) {
        Comment.findOne({ _id: commentID }, function(err, comment) {
            if (err) done(err);
            Utils.removeComment(comment, (err, results) => {
                if (err) done(err);
                User.findOne({ _id: userID }, (err, user) => {
                    if (err) done(err);
                    expect(user).to.exist;
                    expect(user.comments.length).to.equal(0);
                    done();
                });
            });
        })
    });

    after(function(done) {
        // close test database connection
        mongoose.connection.close(done);
    });
});
