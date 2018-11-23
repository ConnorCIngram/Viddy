const User = require('../User/UserScema'),
      mongoose = require('mongoose');
      Schema = mongoose.Schema;

const VideoSchema = new Schema({
    title: { type: String, trim: true, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    uploaded: {type: Date, default: Date.now},
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [ { type: Schema.Types.ObjectId, ref: 'Comment', default: [], required: true } ]
});

// Post save middleware hook that saves the video reference to the user
VideoSchema.post('save', function(vid, next) {
    User.findOneAndUpdate({ _id: vid.author }, { $push: {uploads: [vid._id]} }, next);
});

// Post remove middleware hook to remove the video reference from the user
VideoSchema.post('save', function(vid, next) {
    User.findByIdAndUpdate({ _id: vid.author }, { $pullAll: {uploads: [vid._id]} }, next);
});

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;