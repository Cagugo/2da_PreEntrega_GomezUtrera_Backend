require('dotenv').config();

let config = {
  port: process.env.PORT,
};

let db = {
  mongo_local: process.env.MONGO_LOCAL,
  mongo_atlas: process.env.MONGO_ATLAS,
};

module.exports = {
  config,
  db,
};
