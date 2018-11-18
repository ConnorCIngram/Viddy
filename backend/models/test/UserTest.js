var expect = require('chai').expect,
    assert = require('chai').assert;

var User = require('../User/UserScema'),
    mongoose = require('mongoose');

// USER TESTING
describe('user', function() {
    var SavedEmail = 'testing1@gmail.com';
    var SavedPassword = 'password123';
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
        u.save(done)
    });

    it ('should had password after being saved', function(done) {
        User.findOne({ email: SavedEmail }, function(err, user) {
            if (err) throw err;
            user.comparePassword(SavedPassword, function(err, isMatch) {
                assert(isMatch);
                done();
            })
        });
    })

    it ('should delete from db', function(done) {
        User.findOneAndRemove({email: SavedEmail}, done);
    });

    after(function(done) {
        mongoose.connection.close(done);
    })
});