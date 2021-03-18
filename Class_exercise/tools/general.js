const general = {};

const url = require('url');


general.sessionChecker = function(req, res, next) {
    if (req.cookies.user_sid && req.session.user) {
        return res.redirect('/api/user/dashboard')
    } else {
        return next();
    }
}

general.loginChecker = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect(url.format({
            pathname: '/api/auth/loginPage',
            query: {
                msg: 'Please Login.'
            }
        }))
    } else {
        return next();
    }
}

module.exports = general;