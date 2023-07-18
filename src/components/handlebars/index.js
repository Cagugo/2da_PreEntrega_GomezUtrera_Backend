const { Router } = require('express');
const handlebarsController = require('./handlebarsController/handlebarsController');

module.exports = (app) => {
  const router = new Router();
  app.use('/', router);

  router.get('/', handlebarsController.getInicio);
  router.get('/products', handlebarsController.getProducts);
  router.get('/carts/:cid', handlebarsController.getCartProductById);
  router.get('/home', handlebarsController.getHome);
  router.get('/realTimeProducts', handlebarsController.getRealTimeProducts);
  router.get('/chat', handlebarsController.getChat);
};
