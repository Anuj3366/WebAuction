const express = require('express');
const router = express.Router();
const Product = require('../Schemas/Product.js');
const User = require('../Schemas/Users/customers.js');
const Seller = require('../Schemas/Users/seller.js');
const authorization = require('./authorization.js');

router.get('/checkuserType', authorization, async (req, res) => {
  const { email, password } = req.user;
  const founded = await User.findOne({ email: email, password: password });
  if (founded) {
    if (founded.userType === "seller") {
      const seller = await Seller.findOne({ email: email, password: password });
      if (seller && seller.verified) {
        res.json("seller");
      }
      else {
        res.json("notverified");
      }
    }
    else if (founded.userType === "worker") {
      const worker = await Worker.findOne({ email: email, password: password });
      if (worker && worker.verified) {
        res.json("worker");
      }
      else {
        res.json("notverified");
      }
    }
    else {
      res.json(founded.userType);
    }
  }
  else {
    res.status(401).send("Invalid Credentials");
  }
});

router.get('/getSeller', authorization, async (req, res) => {
  const { email, password } = req.user;
  const founded = await Seller.findOne({ email: email, password: password });
  if (founded && founded.verified) {
    res.json(founded);
  }
  else {
    res.status(401).send("Invalid Access");
  }
});

router.get('/getModerator', authorization, async (req, res) => {
  const { email, password } = req.user;
  const founded = await User.findOne({ email: email, password: password });
  if (founded) {
    res.json(founded);
  }
  else {
    res.status(401).send("Invalid Access");
  }
});

router.post('/becomeSeller', authorization, async (req, res) => {
  const { email, password } = req.user;
  const founded = await User.findOne({ email: email, password: password });
  if (founded && founded.userType === "user") {
    const seller = new Seller({ ...req.body, email, password, verified: false });
    await seller.save();
    await User.findOneAndUpdate({ email: email, password: password }, { userType: "seller" });
    res.json("Seller Created");
  }
  else {
    res.status(401).send("Invalid Access");
  }
});



router.post('/becomeWorker', authorization, async (req, res) => {
  const { email, password } = req.user;
  const founded = await User.findOne({ email: email, password: password });
  if (founded && founded.wantTo === "worker") {
    const worker = new Worker({ email: email, password: password, adhaar: req.body.adhaar, verified: false });
    await worker.save();
    await User.findOneAndUpdate({ email: email, password: password }, { userType: "worker" });
    res.json("Worker Created");
  }
  else {
    res.status(401).send("Invalid Access");
  }
});


router.post('/uploadProduct', authorization, async (req, res) => {
  const { email, password } = req.user;
  const seller = await Seller.findOne({ email: email, password: password });
  if (!seller || !seller.verified) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const product = new Product({ ...req.body, sellerMail: email });
  await product.save();
  await Seller.updateOne({ email: email, password: password }, { $push: { productId: product._id } });
  res.json({ message: 'Product uploaded' });
});


router.put('/product/:id/quantity', authorization, async (req, res) => {
  const { email, password } = req.user;
  const seller = await Seller.findOne({ email: email, password: password });
  if (!seller || !seller.verified) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  const { increaseBy } = req.body;
  try {
    await Product.updateOne({ _id: id }, { $inc: { quantity: increaseBy } });
    res.status(200).json({ message: 'Product quantity updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product quantity' });
  }
});

router.get('/seller/:email/products', async (req, res) => {
  const { email, password } = req.user;
  const seller = await Seller.findOne({ email: email, password: password });
  if (!seller || !seller.verified) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const seller = await Seller.findOne({ email });
    const products = await Product.find({ _id: { $in: seller.productId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching seller products' });
  }
});

router.put('/user/:id/promote', authorization, async (req, res) => {
  const { email, password } = req.user;
  const admin = await User.findOne({ email: email, password: password, userType: 'admin' });
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { userType: 'moderator' });
    res.status(200).json({ message: 'User promoted to moderator' });
  } catch (error) {
    res.status(500).json({ error: 'Error promoting user' });
  }

});
router.put('/seller/:id/verify', authorization, async (req, res) => {
  const { email, password } = req.user;
  const moderator = await User.findOne({ email: email, password: password, userType: 'moderator' });
  if (!moderator) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { userType: 'seller' });
    await Seller.findByIdAndUpdate(id, { verified: true });
    res.status(200).json({ message: 'User promoted to Seller' });
  } catch (error) {
    res.status(500).json({ error: 'Error promoting user' });
  }

});
router.put('/worker/:id/verify', authorization, async (req, res) => {
  const { email, password } = req.user;
  const moderator = await User.findOne({ email: email, password: password, userType: 'moderator' });
  if (!moderator) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { userType: 'worker' });
    await Worker.findByIdAndUpdate(id, { verified: true });
    res.status(200).json({ message: 'User promoted to worker' });
  } catch (error) {
    res.status(500).json({ error: 'Error promoting user' });
  }

});



router.get('/admin/users', authorization, async (req, res) => {
  const { email, password } = req.user;
  const admin = await User.findOne({ email: email, password: password, userType: 'admin' });
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const users = await User.find({ userType: 'user' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
}
);

router.get('/getseller',authorization, async (req, res) => {
  const { email, password } = req.user;
  const admin = await User.findOne({ email: email, password: password, userType: 'admin' });
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    const wantToseller = await Seller.find({verified:false});
    res.status(200).json(wantToseller);
  }
  catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
router.get('/getworker',authorization, async (req, res) => {
  const { email, password } = req.user;
  const admin = await User.findOne({ email: email, password: password, userType: 'admin' });
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    const wantToseller = await Seller.find({verified:false});
    res.status(200).json(wantToseller);
  }
  catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});


module.exports = router;