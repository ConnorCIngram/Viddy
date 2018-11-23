var expect = require('chai').expect,
    assert = require('chai').assert;

var mongoose = require('mongoose'),
    Video = require('../Video/VideoSchema')
    User = require('../User/UserScema'),
    Comment = require('../Comment/CommentSchema'),
    Utils = require('../Utils/Utils');

mongoose.Promise = global.Promise;

/* Video Schema:
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    title: { type: String, trim: true, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    uploaded: {type: Date, default: Date.now},
    likes: Number,
    dislikes: Number,
    comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ]
*/
describe("Video", function() {
    let SampleUser;
    let SampleComments;
    before((done) => {
        mongoose.connect(
            'mongodb://localhost:27017/test', 
            { 
                useNewUrlParser: true, 
                useFindAndModify: false,
                useCreateIndex: true 
            }, 
            function(err) {
                if (err) done(err);
                // Create a valid sample user to test against
                let user = new User({
                    name: {
                        firstname: 'Danny',
                        lastname: 'Phantom'
                    }, email: 'website@email.com',
                    password: 'password123'
                });
                // save the sample user to the test db
                user.save(() => {
                    User.findOne({email: 'website@email.com'}, (err, u) => {
                        if (err) done(err);
                        SampleUser = u;
                        done();
                    });
                });
            }
        );
    });

    var VideoId;
    it ('should be valid & should save to db', function(done) {
        let v = new Video({
            author: SampleUser._id,
            title: 'How to test this entry'
        });
        v.validate(function(err) {
            if (err) done(err);
            v.save((err, vid) => {
                if (err) done(err);
                expect(vid).to.exist;
                VideoId = vid._id;
                done();
            });
        });
    });

    it ('should not validate with missing author', function(done) {
        let v = new Video({
            title: 'This shouldnt validate :P'
        });
        v.validate(function(err, vid) {
            expect(err.errors.author).to.exist;
            expect(vid).to.not.exist;
            done();
        });
    });
    it ('should not validate with missing title', function(done) {
        let v = new Video({
            author: SampleUser._id
        });
        v.validate((err, vid) => {
            expect(err.errors.title).to.exist;
            assert(!vid);
            done();
        })
    });

    it ('should populate author', function(done) {
        Video.findOne({_id: VideoId})
            .populate('author')
            .exec(function(err, vid) {
                if (err) done(err);
                expect(vid.author.name.firstname).to.equal('Danny');
                expect(vid.author.name.lastname).to.equal('Phantom');
                done();
            });
    });
    var CommentId;
    it ('should populate comments', function(done) {
        let c = new Comment({
            from_user: SampleUser._id,
            on_video: VideoId,
            body: "This video is so inspirational! <3"
        });
        c.save(function(err, comment) {
            if (err) done(err);
            CommentId = comment._id;
            Video.findOne({ _id: VideoId }).populate('comments').exec((err, vid) => {
                if (err) done(err);
                expect(vid.comments.length).to.equal(1);
                expect(vid.comments[0].body).to.equal("This video is so inspirational! <3");
                done();
            });
        })
    });

    it ('should have updated video with comment id', function(done) {
        Video.findOne({_id:VideoId}, function(err, vid) {
            if (err) done(err);
            expect(vid).to.exist;
            expect(vid.comments.length).to.equal(1);
            expect(vid.comments[0].toString()).to.equal(CommentId.toString());
            done();
        });
    });
    it ('should have updated user with comment id', function(done) {
        User.findOne({_id:SampleUser._id}, function(err, user) {
            if (err) done(err);
            expect(user).to.exist;
            expect(user.comments.length).to.equal(1);
            expect(user.comments[0].toString()).to.equal(CommentId.toString());
            done();
        });
    });
    var CommentId2;
    it ('should handle multiple comments correctly', function(done) {
        let c = new Comment({
            from_user: SampleUser._id,
            on_video: VideoId,
            body: "This is the second comment from me."
        });
        c.save(function(err, comment) {
            if (err) done(err);
            CommentId2 = comment._id;
            Video.findOne({ _id: VideoId }, function(err, vid) {
                if (err) done(err);
                expect(vid.comments.length).to.equal(2);
                expect(vid.comments[0].toString()).to.equal(CommentId.toString());
                expect(vid.comments[1].toString()).to.equal(CommentId2.toString());
                done();
            });
        });
    });
    
    it ('should remove from db, expect comments to delete', function(done) {
        Video.findOne({ _id: VideoId }, (err, vid) => {
            Utils.removeVideo(vid, (err, results) => {
                if (err) done(err);
                expect(results).to.exist;
                Comment.find({ on_video: VideoId }, (err, docs) => {
                    if (err) done(err);
                    expect(docs).to.exist;
                    expect(docs).to.be.a('Array');
                    expect(docs.length).to.equal(0);
                    done();
                });
            })
        })
    });

    after((done) => {
        // remove sample user and close db connection
        User.findOneAndRemove({ email: 'website@email.com' }, (err, user) => {
            mongoose.connection.close(done);
        })
    })
})