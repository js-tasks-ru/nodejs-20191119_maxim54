const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;
  const products = await Product.find({subcategory: subcategory});
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {products: []};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400);
  }
  const product = await Product.findById(id);
  if (product) {
    ctx.body = {product};
  } else {
    ctx.throw(404);
  }
};

