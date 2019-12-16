const mongoose = require('mongoose');
const connection = require('../libs/connection');

connection.on('error', console.error.bind(console, 'connection error!:'));

const transformId = () => {
  return (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
}

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
},
{
  toObject: {transform: transformId(), versionKey: false},
  toJSON: {transform: transformId(), versionKey: false},
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
},
{
  toObject: {transform: transformId(), versionKey: false},
  toJSON: {transform: transformId(), versionKey: false},
});

module.exports = connection.model('Category', categorySchema);
