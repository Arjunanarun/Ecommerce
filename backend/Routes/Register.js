import express from 'express';
import User from '../Models/user.js';
import bcrypt from 'bcrypt'; // Import bcrypt here

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Removed 'username' from req.body
    const { email, password, mobilenum } = req.body;

    // Check if user exists by email (which is unique)
    const exuser = await User.findOne({ email: email });
    if (exuser) {
      return res.status(409).json("User already exists"); // 409 for duplicates
    }

    // --- Logic moved from model to controller ---
    // Manually hash the password before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // --- End of moved logic ---

    // Create a new user
    const regUser = new User({
      // Username is no longer passed; it will use the model's default (null)
      email: email,
      password: hashedPassword, // Pass the HASHED password
      mobilenum: mobilenum,
    });

    await regUser.save(); // Save the user
    
    console.log("User registered:", regUser.email);
    res.status(201).json("super registered");

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.log("error on register is ", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;