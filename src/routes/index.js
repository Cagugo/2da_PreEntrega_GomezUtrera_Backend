const productsApi = require('../components/products');

const cartsApi = require('../components/carts');

const handlebarsApi = require('../components/handlebars');

const messagesApi = require('../components/messages');

module.exports = (app) => {
  
  productsApi(app);

  cartsApi(app);

  handlebarsApi(app);

  messagesApi(app);
};
