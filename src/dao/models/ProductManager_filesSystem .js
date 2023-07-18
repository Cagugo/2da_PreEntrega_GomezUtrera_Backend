const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const productosFilePath = './data/productos.json';

(async () => {
  try {
    await fs.access(productosFilePath);

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    if (productosData.trim() === '') {
      await fs.writeFile(productosFilePath, '[]');
    }
  } catch (error) {
    await fs.writeFile(productosFilePath, '[]');
  }
})();

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : { status: 'success', payload: products };

    return res.status(200).json(limitedProducts);
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error getting products' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const product = products.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Product not found' });
    }

    return res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error getting product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title, description, code, price, stock, category, thumbnails } = req.body;

    if (id) {
      return res.status(400).json({ status: 'error', error: 'Do not send the product ID, it is generated automatically' });
    }

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(500).json({ status: 'error', error: 'Mark required fields' });
    }

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);
    const existingProduct = products.find((p) => p.code === code);

    if (existingProduct) {
      return res.status(400).json({ status: 'error', error: 'The product with this code already exists' });
    }

    const newProductId = 'pid' + uuidv4().substring(0, 4);
    const newProduct = {

      id: newProductId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || 'Sin imagen',
    };

    products.push(newProduct);

    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(201).json({ status: 'created', message: 'Product added successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error adding product' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateFields = req.body;

    if ('id' in updateFields) {
      return res.status(400).json({ status: 'error', error: 'You should not modify the product id' });
    }

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Product not found' });
    }

    const product = products[productIndex];
    const updatedProduct = {
      ...product,
      ...updateFields,
    };
    products[productIndex] = updatedProduct;

    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(200).json({ status: 'success', message: 'Product updated successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error updating the product' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Product not found' });
    }

    products.splice(productIndex, 1);

    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(200).json({ status: 'success', message: 'Product successfully removed' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error deleting product' });
  }
});
module.exports = router;
