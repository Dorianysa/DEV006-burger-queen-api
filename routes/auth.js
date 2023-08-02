const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');
const { connect } = require('../connect');
const bcrypt = require('bcrypt');


const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.accessToken Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si la autenticación falla (email o contraseña incorrectos)
   * @auth No requiere autenticación
   */
  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }

    try {
      await connect();
      const user = await User.findOne({ email });

      if (!user) {
        return resp.status(404).json({ error: 'Credenciales inválidas' });
      }

      if (!await bcrypt.compare(password, user.password)) {
        return resp.status(404).json({ error: 'Credenciales inválidas' });
      }

      const payload = { email: email, admin: user.roles.admin };
      const options = { expiresIn: '1h' };
      const accessToken = jwt.sign(payload, secret, options);

      return resp.json({ accessToken });
    } catch (error) {
      console.error('Error al autenticar al usuario:', error);
      return next(500);
    }
  });

  return nextMain();
};