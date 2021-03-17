const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const path = require('path');

const authRouter = require(path.join(__dirname, 'routes', 'auth.js'));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);

mongoose.connect('mongodb://localhost:27017/hw18', {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            return console.log('Can not connect to Mongodb');
        }
        console.log('Connected to Mongodb successfully');
    }
)

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.listen(app.get('port'), () => {
    console.log(`App is running on port ${app.get('port')}`);
})