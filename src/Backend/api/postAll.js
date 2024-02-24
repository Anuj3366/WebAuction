const Product = require('../Schemas/Product.js');
const express = require('express');
const connectDB = require('../mongoDB.js');
const User = require('../Schemas/Users/user.js');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
connectDB();

const authorization = require('./autorization.js');
app.post('/newProduct', authorization, async (req, res) => {
  const { email, password } = req.body;
  const founded = await User.findOne({ email: email, password: password });
  if(founded.userType != "user" && founded.userType != "worker"){
    const UID = uuidv4();
    const newProduct = new Product({ ...req.body, id: UID.toString() });
    const saved = await newProduct.save();
    res.json(saved);
  }
  else{
    res.status(403).send("Invalid access");
  }
});
