const express = require('express');
const bcrypt = require('bcrypt');

const path = require('path');
const url = require('url');

const User = require(path.join(path.dirname(__dirname), 'models', 'user'));
const sessionTools = require(path.join(path.dirname(__dirname), 'tools', 'session'));

const router = express.Router();

router.get('/', sessionTools.sessionChecker, (req, res) => {
    res.render('auth/signIn', {
        message: req.query.message || ''
    })
})

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.redirect(url.format({
            pathname: '/auth/signIn',
            query: {
                message: "There are some empty fields."
            }
        }))
    }
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.redirect(url.format({
                pathname: '/auth/signIn',
                query: {
                    message: "Something went wrong."
                }
            }))
        }
        if (!user) {
            return res.redirect(url.format({
                pathname: '/auth/signIn',
                query: {
                    message: "User doesn't exist."
                }
            }))
        }
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) {
                return res.redirect(url.format({
                    pathname: '/auth/signIn',
                    query: { message: 'Server Error.' }
                }))
            }
            if (!isMatch) {
                return res.redirect(url.format({
                    pathname: '/auth/signIn',
                    query: {
                        message: "User doesn't exist."
                    }
                }))
            }
            req.session.user = user;
            res.redirect('/user/dashboard')
        })
    })
})

module.exports = router;