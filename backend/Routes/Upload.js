import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up multer for local storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Save to backend/uploads/
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin (or Public for now)
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Return the relative URL for frontend use
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
