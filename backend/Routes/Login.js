import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/user.js'; // Import the model
import { sendEmail } from '../utils/mail.js';
import bcrypt from 'bcrypt'; // Import bcrypt here

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, mobilenum, password } = req.body;
    let user;

    // Find user by email or mobilenum
    if (email) {
      user = await User.findOne({ email: email });
    } else if (mobilenum) {
      user = await User.findOne({ mobilenum: mobilenum });
    }

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check if user registered with Google and has no password
    if (!user.password) {
        return res.status(401).json({ error: 'Please log in using Google' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      maxAge: 3600000, // 1 hour
    });

    
    return res.status(200).json({
      token: token,
      user: {
        _id: user._id,
        email: user.email,
        mobilenum: user.mobilenum,
        username: user.username,
        isAdmin:user.isAdmin,
      },
    });

  } catch (err) {
    console.log("login - error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

const Auth = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(44).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json(err.message);
  }
};

router.post('/forgotpassword', Auth, async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min

    user.otp = otp;
    user.otp_expiry = expiry;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post('/verifyotp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (!user || user.otp !== otp) {
      return res.status(404).json({ message: "Not Valid OTP" });
    }
    if (Date.now() > user.otp_expiry) {
      return res.status(404).json({ message: "expired" });
    }
    user.otp = null;
    user.otp_expiry = null;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.log("error from verifyotp is ", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/resetpassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // remove OTP fields for safety
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log("reset error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;