import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // ✅ **THIS IS THE FIX**
    // Go up two levels (from 'backend/Routes' to 'YourProject/uploads')
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename(req, file, cb) {
    // Use a date for a unique name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type (optional but recommended)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Upload route
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Return the correct public URL path
  // Make sure your file path has forward slashes
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: filePath.replace(/\\/g, '/') });
});

export default router;