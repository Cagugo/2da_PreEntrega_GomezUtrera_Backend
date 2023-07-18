const HandlebarsServices = require('../handlebarsServices/handlebarsServices');

class HandlebarsController {
  getInicio = async (req, res, next) => {
    return await HandlebarsServices.getInicio(res);
  };
  getHome = async (req, res, next) => {
    return await HandlebarsServices.getHome(res);
  };
  getRealTimeProducts = async (req, res, next) => {
    return await HandlebarsServices.getRealTimeProducts(res);
  };
  getChat = async (req, res, next) => {
    return await HandlebarsServices.getChat(res);
  };
  getProducts = async (req, res, next) => {
    const { limit, page, sort, query } = req.query;
    return await HandlebarsServices.getProducts(limit, page, sort, query, res);
  };
  getCartProductById = async (req, res, next) => {
    const { cid } = req.params;
    const cartId = cid;
    return await HandlebarsServices.getCartProductById(cartId, res);
  };
}
module.exports = new HandlebarsController();
