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
        // ... (GET logic remains the same)
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
        // ... (GET logic remains the same)
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
        // 🛑 SYNCHRONIZED LOGIC: Expects the clean 'images' array directly
        const { name, price, images, category, stock, description, discountPrice, sizes } = req.body;
        
        // Check for required fields (including the clean images array)
        if (!name || !price || !category || !stock || !description || !images || images.length === 0) {
            return res.status(400).json({ message: 'Missing required product fields (Name, Price, Category, Stock, Description, and Images)' });
        }

        const product = new Product({
            name,
            price,
            images, // Directly use the clean array from the client
            category,
            stock,
            description,
            discountPrice,
            sizes,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        // Robust error handling
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            console.error('Mongoose Validation Error:', messages);
            return res.status(400).json({ message: 'Validation failed', errors: messages });
        }
        console.error('Product POST error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    // Destructure all fields from the body
    const { name, price, description, images, category, stock, discountPrice, sizes } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Assignment logic using explicit check (safest method for updates)
            if (name !== undefined) product.name = name;
            if (price !== undefined) product.price = price;
            if (description !== undefined) product.description = description;
            if (stock !== undefined) product.stock = stock;
            if (category !== undefined) product.category = category;

            // Assign new fields
            if (discountPrice !== undefined) product.discountPrice = discountPrice;
            if (sizes !== undefined) product.sizes = sizes;

            // 🛑 SYNCHRONIZED LOGIC: Use the clean 'images' array directly, if sent
            if (images !== undefined) {
                product.images = images;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
            
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
        
    } catch (error) {
        // Robust error handling for PUT
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            console.error('Mongoose Validation Error:', messages);
            return res.status(400).json({ message: 'Validation failed', errors: messages });
        }
        
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Invalid Product ID or Product not found' });
        }

        console.error('Product PUT Unhandled Error:', error); 
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        // ... (DELETE logic remains the same)
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