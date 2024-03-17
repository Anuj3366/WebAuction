const express = require('express');
const router = express.Router();
const authorization = require('./authorization.js');
const Product = require('../Schemas/Product.js');
const User = require('../Schemas/Users/customers.js');


router.post('/addToCart', authorization, async (req, res) => {
  const customer = req.user;
  const foundUser = await User.findOne({ email: customer.email });
  const productId = req.body.productId;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const item = foundUser.cart.find(item => item.productId.toString() === productId);
  if (item) {
    item.quantity += 1;
    foundUser.markModified('cart');
    await foundUser.save();
  }
  else {
    if (product.quantity === 0) {
      return res.status(400).json({ message: 'Product out of stock' });
    }
    foundUser.cart.push({ productId: product._id, quantity: 1 });
    await foundUser.save();
    await Product.updateOne({ _id: productId }, { $inc: { quantity: -1, buyed: 1 } });
  }
  res.json({ message: 'Added to cart' });
});

router.get('/getCart', authorization, async (req, res) => {
  const customer = req.user;
  const foundUser = await User.findOne({ email: customer.email }).populate('cart.productId');
  if (!foundUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(foundUser.cart);
});


router.put('/increaseQuantity', authorization, async (req, res) => {
  const productId = req.body.productId;
  const customer = req.user;
  const foundUser = await User.findOne({ email: customer.email });
  const product = await Product.findOne({ _id: productId });
  if (!product || product.quantity <= 0) {
    return res.status(400).json({ message: 'Product out of stock' });
  }
  const productIdString = String(productId);
  const itemArray = foundUser.cart.filter(item => item.productId.toString() === productIdString);  
  if (itemArray.length === 0) {
    return res.status(404).json({ message: 'Product not found in cart' ,productId});
  }
  const item = itemArray[0];  
  if (product.quantity >= item.quantity + 1) {
    item.quantity += 1;
    foundUser.markModified('cart');
    await foundUser.save();
  }
  else {
    return res.status(400).json({ message: 'Product out of stock' });
  }
});

router.put('/decreaseQuantity', authorization, async (req, res) => {
  const productId = req.body.productId;
  const customer = req.user;
  const foundUser = await User.findOne({ email: customer.email });
  const item = foundUser.cart.find(item => item.productId.toString() === productId);
  if (!item || item.quantity === 1) {
    return res.status(400).json({ message: 'Cannot decrease quantity' });
  }
  item.quantity -= 1;
  product.quantity += 1;
  foundUser.markModified('cart');
  await foundUser.save();
  await product.save();
  res.json({ message: 'Decreased quantity' });
});


router.put('/removeFromCart', authorization, async (req, res) => {
  const productId = req.body.productId;
  const customer = req.user;
  const foundUser = await User.findOne({ email: customer.email });
  const updatedCart = foundUser.cart.filter(item => item.productId.toString() !== productId);
  foundUser.cart = updatedCart;
  await foundUser.save();
  res.json({ message: 'Removed from cart' });
});

module.exports = router;