import express from "express";
import Category from "../Models/category.js";

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}, "_id name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin (or Public for now)
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    // Check for duplicate
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    const category = new Category({ name, slug: name.toLowerCase().replace(/\s+/g, '-') });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
});

export default router;
