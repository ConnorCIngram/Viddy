const mongoose = require('mongoose');
const Schema = mongoose.Schema,
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10;


var UserSchema = new Schema({
    name: {
        firstname: String,
        lastname: String
    },
    email: { type: String, required: true, lowercase: true, index: { unique: true } },
    password: { type: String, required: true },
    uploads: [{ type: Schema.Types.ObjectId, ref: 'Video', default: [] }],
    comments: [ { type: Schema.Types.ObjectId, ref: 'Comment', default: [], required: true } ],
    profilePicURL: {type: String, default: null}
});

/*
    code below from https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
*/

// pasword hashing
UserSchema.pre('save', function(next) {
    console.log("PRE SAVE HOOK");
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


// validate email
UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
 }, 'The e-mail field cannot be empty.');


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);