const express = require('express');
const app = express();
app.use(express.json());
const cart = require('./api/cart');
app.use('/cart', cart);
const checkout = require('./api/checkout');
app.use('/checkout', checkout);
const getAllItems = require('./api/getAll');
app.use('/getAll', getAllItems);
const login = require('./api/login');
app.use('/login', login);
const postAll = require('./api/postAll');
app.use('/postAll', postAll);
const update = require('./api/update');
app.use('/update', update);
const webhook = require('./api/webhook');
app.use('/webhook', webhook);

module.exports = app;