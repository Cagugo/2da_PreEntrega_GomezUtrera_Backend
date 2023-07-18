const mongoose = require('mongoose');

const { db } = require('./index');

mongoose.set('debug', false);
mongoose.set('strictQuery', false);

let connection;

mongoose.connect(db.mongo_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
});

connection = mongoose.connection;

connection.on('connected', () => {
  console.log('Connection created to the DB');
});

connection.on('error', (error) => {
  console.error('Error in the connection with the DB:', error);
});

module.exports = { connection };
