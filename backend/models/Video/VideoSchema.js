const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../User/UserScema'),
      Comment = require('../Comment/CommentSchema');


const VideoSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    title: { type: String, trim: true, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    uploaded: {type: Date, default: Date.now},
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [ { type: Schema.Types.ObjectId, ref: 'Comment', default: [], required: true } ]
});


const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;