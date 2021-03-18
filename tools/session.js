const url = require('url');

module.exports = {
    sessionChecker: (req, res, next) => {
        if (req.cookies.user_sid && req.session.user) {
            return res.redirect('/user/dashboard');
        } else {
            next();
        }
    },

    loginChecker: (req, res, next) => {
        if (!req.session.user) {
            return res.redirect(url.format({
                pathname: '/auth/signIn',
                query: {
                    message: 'Please login first.'
                }
            }))
        } else {
            next()
        }
    }
}