import express from 'express';
import Product from '../Models/product.js';
import { protect, admin } from '../middlewares/authmiddleware.js';

const router = express.Router();

// --- Public Routes ---

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Admin-Only Routes ---

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    // Accept either image (string) or images (array)
    const { name, price, image, images, category, stock, description, discountPrice } = req.body;
    if (!name || !price || (!image && !images) || !category || !stock || !description) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }
    // Prepare images array
    let productImages = [];
    if (images && Array.isArray(images)) {
      productImages = images.map(img => ({ url: img.url || img, alt: img.alt || '' }));
    } else if (image) {
      productImages = [{ url: image, alt: '' }];
    }
    const product = new Product({
      name,
      price,
      images: productImages,
      category,
      stock,
      description,
      discountPrice,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Product POST error:', error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, price, description, image, images, category, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      // Update images
      if (images && Array.isArray(images)) {
        product.images = images.map(img => ({ url: img.url || img, alt: img.alt || '' }));
      } else if (image) {
        product.images = [{ url: image, alt: '' }];
      }
      product.category = category || product.category;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

export default router;