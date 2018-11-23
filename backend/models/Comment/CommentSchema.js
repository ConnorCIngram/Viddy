var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Video = require('../Video/VideoSchema'),
    User = require('../User/UserScema'),
    async = require('async');

const CommentSchema = new Schema({
    from_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    on_video: { type: Schema.Types.ObjectId, ref: 'Video', required: true},
    body: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Post save middleware hook to save the comment reference to the video and user documents on comment save
CommentSchema.post("save", function(comment, next) {
    // console.log("POST SAVE HOOK");
    async.parallel([
        function (callback) {
            // add comment reference to video
            Video.findOneAndUpdate({ _id: comment.on_video }, { $push: { comments: [comment._id] } }, callback);
        }, function (callback) {
            // add comment reference to user
            User.findOneAndUpdate({ _id: comment.from_user }, { $push: { comments: [comment._id] } }, callback);
        }
    ], function(err, results) {
        if (err) throw err;
        next();
    });
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;