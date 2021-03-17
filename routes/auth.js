const express = require('express');

const path = require('path');

const signInRouter = require(path.join(__dirname, 'signIn.js'));
const signUpRouter = require(path.join(__dirname, 'signUp.js'));

const router = express.Router();

router.use('/signIn', signInRouter);
router.use('/signUp', signUpRouter);

module.exports = router;