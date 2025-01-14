const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Desayuno', 'Almuerzo', 'Cena', 'Snack']
  },
  dateEntry: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports.productSchema = productSchema;
module.exports.Product = Product;