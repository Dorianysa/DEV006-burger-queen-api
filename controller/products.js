const { Product } = require('../models/product.model');
const { connect } = require('../connect');

module.exports = {
  getProducts: async (req, resp, next) => {
    try {
      const page = parseInt(req.query._page) || 1;
      const limit = parseInt(req.query._limit) || 10;
      const skip = (page - 1) * limit;
      await connect();
      const products = await Product.find().skip(skip).limit(limit);

      return resp.json(products);
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
      return next(500);
    }
  },

  createProduct: async (req, resp, next) => {
    try {
        const { name, price, image, type } = req.body;

        if (!name || !price || !image || !type) {
            return next(400);
        }

        await connect();
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return next(403);
        }

        const newProduct = new Product({ name, price, image, type });
        const createdProduct = await newProduct.save();
        return resp.status(200).json(createdProduct);
    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        return next(500);
    }
  },

  getProductById: async (req, resp, next) => {
    try {
      const { productId } = req.params;

      await connect();
      let product;
      product = await Product.findById(productId);

      if (!product) {
        return next(404);
      }
      return resp.json(product);
    } catch (error) {
      console.error('Error al obtener información del producto:', error);
      return next(404);
    }
  },

  updateProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const { name, price, image, type } = req.body;

      await connect();
      const product = await Product.findById(productId);

      if (!product) {
        return next(404);
      }
      if (name) {
        product.name = name;
      }
      if (price) {
        product.price = price;
      }
      if (image) {
        product.image = image;
      }
      if (type) {
        product.type = type;
      }

      const updatedProduct = await product.save();

      return resp.json(updatedProduct);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return next(500);
    }
  },

  deleteProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;

      await connect();
      const product = await Product.findById(productId);
      const deletedProduct = await Product.deleteOne({ _id: productId });

      if (deletedProduct.deletedCount === 0) {
        return next(404);
      }

      return resp.json(product);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return next(500);
    }
  },


};