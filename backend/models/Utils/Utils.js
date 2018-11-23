const mongoose = require('mongoose'),
      User = require('../User/UserScema'),
      Video = require('../Video/VideoSchema'),
      Comment = require('../Comment/CommentSchema'),
      async = require('async');

/*
    Utils.js contains removal functions for each model
    to avoid a circular dependency issue. Each removal
    updates or removes another document from another
    collection.
*/

// remove user and corresponding videos and comments
function removeUser(user, next) {
    async.parallel([
        function (callback) {
            // delete user
            User.findOne({ _id: user._id }, (err, doc) => {
                if (err) callback(err);
                doc.remove(callback);
            });
        }, function (callback) {
            // delete videos from users uploads
            Video.deleteMany({ author: user._id }, callback);
        }, function (callback) {
            // delete comments from users comments
            Comment.deleteMany({ from_user: user._id }, callback);
        }
    ], next);
};

// remove video and corresponding comments
function removeVideo(video, next) {
    async.parallel([
        function (callback) {
            // remove video
            Video.findOne({ _id: video._id }, (err, doc) => {
                if (err) callback(err);
                doc.remove(callback);
            });
        }, function (callback) {
            // remove video reference in users uploads
            User.findOneAndUpdate({ _id: video.author }, {$pullAll: { uploads: [video._id] }}, callback);
        }, function (callback) {
            // remove comments on video
            Comment.deleteMany({ on_video: video._id }, callback);
        }
    ], next);
};

// remove comment and update corresponding video and user
function removeComment(comment, next) {
    async.parallel([
        function (callback) {
            // remove comment
            Comment.findOne({ _id: comment._id }, (err, doc) => {
                if (err) callback(err);
                doc.remove(callback);
            });
        }, function (callback) {
            // remove comment reference in video
            Video.findOneAndUpdate({ _id: comment.on_video }, { $pullAll: { comments: [comment._id] } }, callback);
        }, function (callback) {
            // remove comment reference in user
            User.findOneAndUpdate({ _id: comment.from_user }, { $pullAll: { comments: [comment._id] } },callback);
        }
    ], next);
};

module.exports = {
    removeUser: removeUser,
    removeVideo: removeVideo,
    removeComment: removeComment
};