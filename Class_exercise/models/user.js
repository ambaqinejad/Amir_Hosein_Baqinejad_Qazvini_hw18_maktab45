const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 40
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', function(next) {
    const user = this;
    if (user.isNew || user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                return next()
            })
        })
    } else {
        return next()
    }
})

module.exports = mongoose.model('User', UserSchema)