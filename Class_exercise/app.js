const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const apiRouter = require('./routes/api');

const app = express();
mongoose.connect('mongodb://localhost:27017/session', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}, (err) => {
    if (err) {
        return console.log(`Connection failed`)
    }
    console.log(`Server connected to db successfully.`)
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: 'user_sid',
    secret: 'mySecretKey',
    saveUninitialized: false,
    resave: false,
    cookie: { expires: 600000 }
}));


// app.get('/', (req, res, next) => {
//     console.log(req.session);
//     next();
// })

// app.get('/set', (req, res) => {
//     res.cookie('name', 'Amir Hosein');
//     res.json(true);
// })

// app.get('/get', (req, res) => {
//     res.json(req.cookies);
// })

// app.get('/delete', (req, res) => {
//     res.clearCookie('name')
//     res.json(true);
// })

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;