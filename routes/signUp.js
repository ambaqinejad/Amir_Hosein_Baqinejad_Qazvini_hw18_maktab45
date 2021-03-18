const express = require('express');
const bcrypt = require('bcrypt')

const path = require('path');
const url = require('url');

const User = require(path.join(path.dirname(__dirname), 'models', 'user'));
const sessionTools = require(path.join(path.dirname(__dirname), 'tools', 'session'));


const router = express.Router();

router.get('/', sessionTools.sessionChecker, (req, res) => {
    return res.render('auth/signUp', {
        message: req.query.message || ''
    });
})

router.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.redirect(url.format({
            pathname: '/auth/signUp',
            query: {
                message: "There are some empty fields."
            }
        }))
    }
    if (req.body.username.length < 3 ||
        req.body.username.length > 20 ||
        req.body.password.length < 4 ||
        req.body.password.length > 20) {
        return res.redirect(url.format({
            pathname: '/auth/signUp',
            query: {
                message: "Username or Password is unsatisfied."
            }
        }))
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.redirect(url.format({
                pathname: '/auth/signUp',
                query: {
                    message: "Something went wrong."
                }
            }))
        }
        if (user) {
            return res.redirect(url.format({
                pathname: '/auth/signUp',
                query: {
                    message: "User already exist."
                }
            }))
        }
        new User({
            username: req.body.username,
            password: req.body.password
        }).save(err => {
            if (err) {
                return res.redirect(url.format({
                    pathname: '/auth/signUp',
                    query: {
                        message: "Something went wrong."
                    }
                }))
            }
            return res.redirect('/auth/signIn');
        })
    })
})

module.exports = router;