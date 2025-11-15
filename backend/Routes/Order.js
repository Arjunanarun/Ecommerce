import express from 'express';
import Order from '../Models/order.js';
import { protect, admin } from '../middlewares/authmiddleware.js';

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    // Populate the 'user' field, only selecting 'id' and 'email'
    const orders = await Order.find({}).populate('user', 'id email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// Get logged-in user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// You would add more routes here, e.g., POST /api/orders (for users)
// or PUT /api/orders/:id/deliver (for admins)

export default router;