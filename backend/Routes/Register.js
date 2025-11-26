import express from 'express';
import User from '../Models/user.js';
import bcrypt from 'bcrypt'; // Import bcrypt here

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password, mobilenum } = req.body;

    const exuser = await User.findOne({ email: email });
    if (exuser) {
      return res.status(409).json("User already exists"); // 409 for duplicates
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const regUser = new User({
      email: email,
      password: hashedPassword, 
      mobilenum: mobilenum,
    });

    await regUser.save(); 
    
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