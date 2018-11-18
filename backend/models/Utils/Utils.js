const Comment = require('../Comment/CommentSchema'),
      User = require('../User/UserScema')
      Video = require('../Video/VideoSchema')
      mongoose = require('mongoose'),
      async = require('async');

// creates and saves a new comment to the db.
//   then saves comment id to the corresponding video and user
function createComment(args, cb) {
    let c = new Comment(args);
    c.save((err, comment) => {
        if (err) cb(err);
        async.parallel([
            function(callback) {
                // update user with new comment id
                User.findOneAndUpdate({_id:comment.from_user},{$push:{comments:comment._id}}, (err, user) => {
                    if (err) callback(err);
                    callback();
                })
            }, function(callback) {
                //update video with new comment id
                Video.findOneAndUpdate({_id:comment.on_video},{$push:{comments:comment._id}}, (err, vid) => {
                    if (err) callback(err);
                    callback();
                });
            }
        ], function done(err, results) {
            if (err) throw err;
            cb(err, comment);
        });
    });
};

function removeComment(commentID, cb) {
    // find a remove comment from db
    Comment.findOneAndRemove({_id:commentID}, (err, c) => {
        if (err) cb(err);
        // find a remove the comment reference in the corresponding video and user async
        async.parallel([
            function(callback) {
                // remove comment reference from video
                Video.findOneAndUpdate({_id: c.on_video}, {$pullAll: {comments: [commentID]}}, (err, vid) => {
                    if (err) callback(err);
                    callback();
                })
            }, function(callback) {
                // remove comment reference from user
                User.findByIdAndUpdate({_id: c.from_user}, {$pullAll: {comments: [commentID]}}, (err, user) => {
                    if (err) callback(err);
                    callback();
                })
            }
        ], function done(err, results) {
            if (err) cb(err);
            cb(err, c);
        });
    });
};

module.exports = {
    createComment: createComment,
    removeComment: removeComment
};