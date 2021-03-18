const express = require('express');
const path = require('path');

const User = require(path.join(path.dirname(__dirname), 'models', 'user'));
const sessionTools = require(path.join(path.dirname(__dirname), 'tools', 'session'));
const bcrypt = require('bcrypt');
const url = require('url');

const router = express.Router();

router.get('/dashboard', sessionTools.loginChecker, (req, res) => {
    res.render('userDashboard', {
        user: req.session.user,
        message: req.query.message || ''
    })
})

router.post('/update', sessionTools.loginChecker, (req, res) => {
    User.findOne({ username: req.body.oldUsername }, (err, user) => {
        if (err) {
            return res.redirect(url.format({
                pathname: '/user/dashboard',
                query: {
                    message: "Something went wrong."
                }
            }))
        }
        if (!user) {
            return res.redirect(url.format({
                pathname: '/user/dashboard',
                query: {
                    message: "User does not exist."
                }
            }))
        }
        bcrypt.compare(req.body.oldPassword, user.password, (err, isMatch) => {
            if (err) {
                return res.redirect(url.format({
                    pathname: '/user/dashboard',
                    query: { message: 'Server Error.' }
                }))
            }
            if (!isMatch) {
                return res.redirect(url.format({
                    pathname: '/user/dashboard',
                    query: {
                        message: "User doesn't exist."
                    }
                }))
            }

            User.findOne({ username: req.body.newUsername }, (err, user) => {
                if (err) {
                    return res.redirect(url.format({
                        pathname: '/user/dashboard',
                        query: { message: 'Server Error.' }
                    }))
                }
                if (user && user.username !== req.body.oldUsername) {
                    return res.redirect(url.format({
                        pathname: '/user/dashboard',
                        query: {
                            message: "User already exist."
                        }
                    }))
                }
                User.findOneAndUpdate({ username: req.body.oldUsername }, {
                    username: req.body.newUsername,
                    password: req.body.newPassword
                }, err => {
                    if (err) {
                        return res.redirect(url.format({
                            pathname: '/user/dashboard',
                            query: {
                                message: "Something went wrong."
                            }
                        }))
                    }
                    req.session.user = null;
                    return res.redirect('/auth/signIn');
                })
            })
        })
    })
})

router.post('/logout', (req, res) => {
    req.session.user = null;
    return res.redirect('/auth/signIn');
})

module.exports = router;