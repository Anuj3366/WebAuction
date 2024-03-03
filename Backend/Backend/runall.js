const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);
const connectDB = require('./mongoDB');
connectDB();
// console.log("connectDB ran");

const getAllItems = require('./api/getAll');
app.use('/', getAllItems);
// console.log("getAll ran");
const cart = require('./api/cart');
app.use('/', cart);
// console.log("cart ran");
const checkout = require('./api/checkout');
app.use('/', checkout);
// console.log("checkout ran");
const login = require('./api/login');
app.use('/', login);
// console.log("login ran");
const postAll = require('./api/postAll');
app.use('/', postAll);
// console.log("postAll ran");
const update = require('./api/update');
app.use('/', update);
// console.log("update ran");
const webhook = require('./api/webhook');
app.use('/', webhook);
// console.log("webhook ran");

console.log("All routes are running");



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});