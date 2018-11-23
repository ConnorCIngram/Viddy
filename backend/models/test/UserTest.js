var expect = require('chai').expect,
    assert = require('chai').assert;

var User = require('../User/UserScema'),
    Video = require('../Video/VideoSchema'),
    mongoose = require('mongoose'),
    async = require('async');

// USER TESTING
describe('user', function() {
    var SavedEmail = 'testing1@gmail.com';
    var SavedPassword = 'password123';
    var UserId;
    var CommentId;
    before( function(done) {
        mongoose.connect(
            'mongodb://localhost:27017/test', 
            { 
                useNewUrlParser: true, 
                useFindAndModify: false, 
                useCreateIndex: true 
            }, 
            function(err) {
                if (err) console.log(err);
                done();
            }
        );
    });
    it ('should be invalid if fields is empty', function(done) {
        let u = new User();

        u.validate(function(err) {
            expect(err.errors).to.exist;
            done();
        });
    });

    it ('should be invalid if email is empty', function(done) {
        let u = new User({
            name: {
                firstname: 'Tom',
                lastname: 'Sanchez'
            },
            password: 'password123'
        });

        u.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        })
    });

    it ('should be invalid if password is empty', function(done) {
        let u = new User({
            email: 'testing@mocha.com'
        });

        u.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        })
    });

    it ('should save to db', function(done) {
        let u = new User({
            name: {
                firstname: 'Tom',
                lastname: 'Sanchez'
            }, email: SavedEmail,
            password: SavedPassword
            
        });
        u.save((err, user) => {
            if (err) done(user);
            UserId = user._id;
            done();
        })
    });

    it ('should had password after being saved', function(done) {
        User.findOne({ email: SavedEmail }, function(err, user) {
            if (err) throw err;
            user.comparePassword(SavedPassword, function(err, isMatch) {
                assert(isMatch);
                done();
            })
        });
    });
    var VideoId;
    it ('Create test video', function(done) {
        let v = new Video({
            title: 'User Test Video',
            author: UserId
        });
        v.save((err, vid) => {
            if (err) done(err);
            expect(vid).to.exist;
            VideoId = vid._id;
            done();
        });
    });

    it ('should update on comment save', function(done) {
        let c = new Comment({
            from_user: UserId,
            on_video: VideoId,
            body: "User Test Comment bleh blah zoop zap"
        });
        c.save((err, comment) => {
            CommentId = comment._id;
            User.findOne({_id: UserId}, function(err, user) {
                if (err) done(err);
                expect(user.comments.length).to.equal(1);
                expect(user.comments[0].toString()).to.equal(CommentId.toString());
                done();
            })
        });
    })

    it ('should delete from db', function(done) {
        User.findOneAndRemove({email: SavedEmail}, done);
    });

    after(function(done) {
        async.parallel([
            function(callback) {
                User.deleteMany({}, callback);
            }, function(callback) {
                Video.deleteMany({}, callback);
            }, function(callback) {
                Comment.deleteMany({}, callback);
            }
        ], function(err, results) {
            if (err) throw err;
            mongoose.connection.close(done);
        });
    });
});