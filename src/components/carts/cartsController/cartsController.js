const cartsService = require('../cartsServices/cartsServices');

class CartsController {
  addCart = async (req, res, next) => {
    return await cartsService.addCart(res);
  };
  getCartProductById = async (req, res, next) => {
    const { cid } = req.params;
    return await cartsService.getCartProductById(cid, res);
  };
  addProductToCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    return await cartsService.addProductToCart(cid, pid, quantity, res);
  };
  deleteCart = async (req, res, next) => {
    const { cid } = req.params;
    return await cartsService.deleteCart(cid, res);
  };
  deleteProductFromCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    return await cartsService.deleteProductFromCart(cid, pid, res);
  };
  updateCart = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;
    await cartsService.updateCart(cid, products, res);
  };
  updateProductQuantity = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartsService.updateProductQuantity(cid, pid, quantity, res);
  };
  deleteAllProductsFromCart = async (req, res, next) => {
    const { cid } = req.params;
    await cartsService.deleteAllProductsFromCart(cid, res);
  };
}
module.exports = new CartsController();
