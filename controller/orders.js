const Order = require('../models/order.model');
const { connect } = require('../connect');

module.exports = {
  getOrders: async (req, resp, next) => {
    try {
      const page = parseInt(req.query._page) || 1;
      const limit = parseInt(req.query._limit) || 10;
      const skip = (page - 1) * limit;
      await connect();
      const orders = await Order.find().skip(skip).limit(limit);

      return resp.json(orders);
    } catch (error) {
      console.error('Error al obtener la lista de ordenes:', error);
      return next(500);
    }
  },

  createOrder: async (req, resp, next) => {
    try {
        const { userId, client, products } = req.body;

        if (!userId || !client || !products) {
            return next(400);
        }

        await connect();
        const lastOrder = await Order.findOne().sort({ id: -1 });
        const newId = lastOrder ? lastOrder.id + 1 : 1;
        const newOrder = new Order({ id: newId, userId, client, products, status: 'pending' });
        const createdOrder = await newOrder.save();
        return resp.status(200).json(createdOrder);
    } catch (error) {
        console.error('Error al crear la nueva orden:', error);
        return next(500);
    }
  },

  getOrderById: async (req, resp, next) => {
    try {
      const { orderId } = req.params;

      await connect();
      let order;
      order = await Order.find({ id: orderId });

      if (!order) {
        return next(404);
      }
      return resp.json(order);
    } catch (error) {
      console.error('Error al obtener información de la orden:', error);
      return next(404);
    }
  },

  updateOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      await connect();
      const order = await Order.findOne({ id: orderId, status: 'pending' });
      if (!order) {
        return next(404);
      }
      if (status) {
        order.status = status;
      }

      const updatedOrder = await order.save();
      return resp.json(updatedOrder);
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      return next(500);
    }
  },

  deleteOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;

      await connect();
      const order = await Order.findOne({ id: orderId, status: 'pending' });

      if (!order) {
        return next(404);
      }
      order.status = 'cancelled';

      const updatedOrder = await order.save();
      return resp.json(updatedOrder);
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
      return next(500);
    }
  },


};