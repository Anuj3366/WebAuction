import { Product } from "@/models/Product";
import express from 'express';
import connectDB from '../connectDB.js';
import authorization from './authorization.js';

const app = express();
app.use(express.json());
connectDB();


app.get('/getAllProduct', authorization, async (req, res) => {
  const products = await Product.find({}, null, { sort: { '_id': -1 } });
  res.json(products);
});

app.get('/getAllAuction', authorization, async (req, res) => {
  const products = await Product.find({ isAuction: true }, null, { sort: { '_id': -1 } });
  res.json(products);
});