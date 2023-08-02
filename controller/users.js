const User = require('../models/user.model');
const { connect } = require('../connect');
const bcrypt = require('bcrypt');

module.exports = {
  getUsers: async (req, resp, next) => {
    try {
      const page = parseInt(req.query._page) || 1;
      const limit = parseInt(req.query._limit) || 10;
      const skip = (page - 1) * limit;
      await connect();
      const users = await User.find().skip(skip).limit(limit);

      return resp.json(users);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      return next(500);
    }
  },

  createUser: async (req, resp, next) => {
    try {
      const { email, password, roles } = req.body;

      if (!email || !password) {
        return next(400);
      }

      await connect();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(403);
      }

      const newUser = new User({
        email,
        password: bcrypt.hashSync(password, 10),
        roles,
      });
      const createdUser = await newUser.save();
      return resp.status(200).json(createdUser);
    } catch (error) {
      console.error('Error al crear un nuevo usuario:', error);
      return next(500);
    }
  },

  getUserByIdOrEmail: async (req, resp, next) => {
    try {
      const { uid } = req.params;

      await connect();

      let user;
      if (uid.includes('@')) {
        user = await User.findOne({ email: uid });
      } else {
        user = await User.findById(uid);
      }

      if (!user) {
        return next(404);
      }

      return resp.json(user);
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      return next(404);
    }
  },

  updateUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const { password, roles } = req.body;

      await connect();
      const query = uid.includes('@') ? { email: uid } : { _id: uid };
      const user = await User.findOne(query);

      if (!user) {
        return next(404);
      }
      if (req.body.email) {
        return next(400);
      }
      if (password) {
        user.password = bcrypt.hashSync(password, 10);
      }
      if (roles) {
        user.roles = roles;
      }

      const updatedUser = await user.save();

      return resp.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return next(500);
    }
  },

  deleteUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;

      await connect();
      const query = uid.includes('@') ? { email: uid } : { _id: uid };
      const user = await User.findOne(query);
      const deletedUser = await User.deleteOne(query);

      if (deletedUser.deletedCount === 0) {
        return next(404);
      }

      return resp.json(user);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return next(500);
    }
  },

};