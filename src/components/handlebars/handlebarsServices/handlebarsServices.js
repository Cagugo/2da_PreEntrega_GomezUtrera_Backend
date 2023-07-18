const { connection } = require('../../../config/mongo');
const ProductsServices = require('../../products/productsServices/productsServices');
const { Cart } = require('../../../models/carts');

class HandlebarsServices {
  async getInicio(res) {
    try {
      return res.render('inicio', { success: true, title: 'Inicio', style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }
  async getCollectionData(collectionName, res) {
    try {
      const database = connection;
      const collection = database.collection(collectionName);
      const data = await collection.find().toArray();
      return data;
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }
  async getHome(res) {
    try {
      const products = await this.getCollectionData('products');
      return res.render('home', { success: true, title: 'Home', products, style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }
  async getRealTimeProducts(res) {
    try {
      const products = await this.getCollectionData('products');
      return res.render('realTimeProducts', { success: true, title: 'Real Time Products', products, style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  async getChat(res) {
    try {
      return res.render('chat', { success: true, title: 'Chat', style: 'index.css' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  async getProducts(limit, page, sort, query, res) {
    try {
      const products = await ProductsServices.getProducts(limit, page, sort, query, res);
      const context = {
        success: true,
        title: 'Productos',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
      };

      return res.render('products', context);
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error Handlebars' });
    }
  }

  async getCartProductById(cid, res) {
    try {
      const cart = await Cart.findById(cid).populate('products.productId', '-__v');
      const formattedCart = {
        _id: cart._id,
        products: cart.products.map((item) => ({
          productId: {
            _id: item.productId._id,
            title: item.productId.title,
            description: item.productId.description,
            code: item.productId.code,
            price: item.productId.price,
            stock: item.productId.stock,
            category: item.productId.category,
          },
          quantity: item.quantity,
        })),
      };

      const context = {
        success: true,
        title: 'Carts',
        carts: [formattedCart],
        cartId: cid,
        style: 'index.css',
      };

      return res.render('carts', context);
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Error getCartProductById Handlebars' });
    }
  }
}
module.exports = new HandlebarsServices();
