const express = require('express');
const router = express.Router();
const url = require('url');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const generalTools = require('../tools/general');


router.get('/registerPage', generalTools.sessionChecker, (req, res, next) => {
    res.render('auth/register', {
        msg: req.query.msg || ''
    })
})

router.post('/register', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.redirect(url.format({
            pathname: '/api/auth/registerPage',
            query: { msg: 'Empty username or password.' }
        }))
    }

    User.findOne({ username: req.body.username.trim() }, (err, user) => {
        if (err) {
            return res.redirect(url.format({
                pathname: '/api/auth/registerPage',
                query: { msg: 'Server Error.' }
            }))
        }
        if (user) {
            return res.redirect(url.format({
                pathname: '/api/auth/registerPage',
                query: { msg: 'User already registered.' }
            }))
        }

        new User({
            username: req.body.username,
            password: req.body.password
        }).save((err) => {
            if (err) {
                return res.redirect(url.format({
                    pathname: '/api/auth/registerPage',
                    query: { msg: 'Server Error.' }
                }))
            }
            return res.redirect(url.format({
                pathname: '/api/auth/loginPage'
            }))
        })
    })

})

router.get('/loginPage', generalTools.sessionChecker, (req, res) => {
    res.render('auth/login', {
        msg: req.query.msg || ''
    })
})

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.redirect(url.format({
            pathname: '/api/auth/loginPage',
            query: { msg: 'Empty username or password.' }
        }))
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.redirect(url.format({
                pathname: '/api/auth/loginPage',
                query: { msg: 'Server Error.' }
            }))
        }

        if (!user) {
            return res.redirect(url.format({
                pathname: '/api/auth/loginPage',
                query: { msg: 'user not found.' }
            }))
        }

        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) {
                return res.redirect(url.format({
                    pathname: '/api/auth/loginPage',
                    query: { msg: 'Server Error.' }
                }))
            }
            if (!isMatch) {
                return res.redirect(url.format({
                    pathname: '/api/auth/loginPage',
                    query: { msg: 'user not found.' }
                }))
            }

            req.session.user = user;
            return res.redirect('/api/user/dashboard')
        })


        // return res.redirect(url.format({
        //     pathname: '/api/auth/loginPage'
        // }))
    })
})

module.exports = router;