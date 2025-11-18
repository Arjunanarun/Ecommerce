import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Auth Routes ---
import loginRoute from './Routes/Login.js';
import registerRoute from './Routes/Register.js';
import authRoute from './Routes/Auth.js';

// --- New Admin API Routes ---
import productRoutes from './Routes/Product.js';
import orderRoutes from './Routes/Order.js';
import userRoutes from './Routes/User.js';
import categoryRoutes from './Routes/Category.js';
import uploadRoutes from './Routes/Upload.js';

// --- DB Connection ---
import { DatabaseConnect } from './utils/db.js';

const app = express();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
DatabaseConnect();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ **THIS IS THE FIX**
// Serve the 'uploads' folder from the project root (one level up from 'backend')
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

// --- Old Auth Routes ---
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/auth', authRoute);

app.post('/test', (req, res) => {
  console.log(req.body);
  res.json({ received: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});