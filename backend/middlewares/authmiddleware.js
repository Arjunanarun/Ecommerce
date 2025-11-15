import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

// Middleware to check if user is logged in
const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'token' cookie
  token = req.cookies.token;

  if (token) {
    try {
      // Verify the token using your SECRET_KEY
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Find the user by the ID in the token and attach it to the request
      // We exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

export { protect, admin };