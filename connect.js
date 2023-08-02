const mongoose = require('mongoose');
const config = require('./config');

const { dbUrl } = config;
let cachedConnection = null; // Variable para almacenar la conexión en caché

async function connect() {
  if (cachedConnection) {
    console.log('Usando la conexión en caché...');
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedConnection = connection;
    console.log('Conexión a la Base de Datos exitosa!');
    return connection;
  } catch (error) {
    console.error('Error al conectar a la Base de Datos:', error);
    throw error;
  }
}

module.exports = { connect };