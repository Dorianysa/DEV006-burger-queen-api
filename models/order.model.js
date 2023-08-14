const mongoose = require('mongoose');
const { productSchema } = require('./product.model');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
      type: String,
      required: true
  },
  client: {
      type: String,
      required: true
  },
  products: [{
    qty: {
      type: Number,
      required: true
    },
    product: productSchema
  }],
  status: {
      type: String,
      required: true,
      enum: ['pending', 'delivered', 'cancelled']
  },
  dateEntry: {
      type: Date,
      default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;