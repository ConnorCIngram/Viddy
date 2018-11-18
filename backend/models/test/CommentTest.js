const mongoose = require('mongoose'),
      Comment = require('../Comment/CommentSchema'),
      {createComment, removeComment} = require('../Utils/Utils'),
      User = require('../User/UserScema'),
      Video = require('../Video/VideoSchema'),
      expect = require('chai').expect,
      assert = require('chai').assert;

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

    it('should be invalid without a user', function(done) {
        // test stuff
        done();
    });

    after(function(done) {
        // close test database connection
        mongoose.connection.close(done);
    });
});
