import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); //load env file to use the values
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';

// --- Old Auth Routes ---
import loginRoute from './Routes/Login.js';
import registerRoute from './Routes/Register.js';
import authRoute from './Routes/Auth.js';

// --- New Admin API Routes ---
import productRoutes from './Routes/Product.js';
import orderRoutes from './Routes/Order.js';
import userRoutes from './Routes/User.js';
import categoryRoutes from './Routes/Category.js';

// --- Database Connection ---
import { DatabaseConnect } from './utils/db.js';

const PORT = process.env.PORT || 5000;
DatabaseConnect(); // Establish Database Connection

app.use(express.json()); // for Parsing the Request and Response
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for Reading data from url form
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
); //Cross Origin Resource sharing

// --- API Routes ---

// The frontend calls /api/products, /api/orders, /api/users
// These routes MUST be protected by your 'protect' and 'admin' middleware
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// --- Old Auth Routes ---
// The frontend calls /login, /register, /auth
// These routes are public and handle the login/signup process
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/auth', authRoute);

app.post('/test', (req, res) => {
  console.log(req.body);
  res.json({ received: req.body });
});

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});