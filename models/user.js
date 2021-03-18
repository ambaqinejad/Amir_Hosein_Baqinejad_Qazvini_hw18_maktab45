const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: true
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
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                return next();
            })
        })
    } else {
        return next()
    }
})

UserSchema.pre('findOneAndUpdate', function(next) {
    const info = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(info._update.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            info._update.password = hash;
            return next();
        })
    })
})

module.exports = mongoose.model('User', UserSchema);