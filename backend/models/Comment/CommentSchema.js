var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Video = require('../Video/VideoSchema'),
    User = require('../User/UserScema');
    

const CommentSchema = new Schema({
    from_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    on_video: { type: Schema.Types.ObjectId, ref: 'Video', required: true},
    body: { type: String, required: true },
    date: { type: Date, default: Date.now }
});



const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;