import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load BASE_URL from env (must be set in Render dashboard)
const BASE_URL = process.env.BASE_URL;

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Uploads folder (one level above backend folder)
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload route
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Build the full public URL (important!)
  const fullImageUrl = `${BASE_URL}/uploads/${req.file.filename}`;

  res.status(201).json({
    url: fullImageUrl,
  });
});

export default router;
