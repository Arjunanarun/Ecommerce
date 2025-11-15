import express from 'express';
import User from '../Models/user.js';
import { protect, admin } from '../middlewares/authmiddleware.js';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    // Exclude passwords when fetching all users
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// Update logged-in user's profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.mobilenum = req.body.mobilenum || user.mobilenum;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

// You would add more routes here, e.g., DELETE /api/users/:id (for admins)
// or GET /api/users/profile (for logged-in users)

export default router;