// set up express app
const express = require('express');
const app = express();

// import logging tool
const morgan = require('morgan');

// import json body parser
const bodyParser = require('body-parser');

// imprt mongoose for mongoDB
const mongoose = require('mongoose');

// retrieve specific router
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// connect database
const database = "shop";
const URI = `mongodb+srv://minh317:${process.env.MONG_ATLAS_PW}@cluster0.oe8q3.mongodb.net/${database}?retryWrites=true&w=majority`
mongoose.connect(URI)
        .then(() => {
            console.log('✔ Connected to database!');
        }).catch(() => {
            console.log('❌ Cannot connect to database!')
        });
mongoose.Promise = global.Promise;
// use morgan middleware before any routing
app.use(morgan('dev'));

// make upload folder publicly visible
app.use('/uploads', express.static('uploads'));

// use bodyParser middleware to parse body of any incoming request
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// handle CORS error
app.use((req, res, next) => {
    // define client that hass access to
    // * means allow access for any client
    res.header('Access-Control-Allow-Origin', '*');

    // define which headers to be sent
    res.header(
        'Access-Control-Allow-Headers',
        'Orgiin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    // check request method
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

// route to specific path
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// if an URL passes through all previous routes, it means that it is an error
// and enters an error creation middleware
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;

    // forward error
    next(error);
});

// handle error middleware
app.use((err, req, res, next) => {
    // if there is no specific eror status code, status code 500 is used instead
    res.status(err.status || 500);
    res.json({
        error : {
            message : err.message
        }
    });
});

module.exports = app;