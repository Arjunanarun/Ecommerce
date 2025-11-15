import express from 'express';
import qs from "qs";
import axios from "axios";
import User from '../Models/user.js'; // Import the model
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google', (req, res) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const SCOPE = process.env.SCOPE;
  const REDIRECT_URL = process.env.REDIRECT_URL;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=${encodeURIComponent(SCOPE)}`;
  console.log(url);
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URL = process.env.REDIRECT_URL;

  const { code } = req.query;
  try {
    const gtoken = await axios.post('https://oauth2.googleapis.com/token',
      qs.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = gtoken.data.access_token;
    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // === FIX ===
    // Get the 'id' from Google and name it 'googleId'
    const { email, name, id: googleId } = userInfo.data;

    // Find user by their Google ID first
    let user = await User.findOne({ googleId: googleId });

    if (!user) {
      // If not found by googleId, check by email
      user = await User.findOne({ email: email });
    }
    
    if (!user) {
      // No user found, create a new one
      // This will work because the model's 'required' logic for password
      // will be skipped since 'googleId' is present.
      user = new User({
        username: name,
        email: email,
        googleId: googleId, // <-- This is the crucial line
      });
      await user.save();
    } else if (user && !user.googleId) {
      // If user exists (from email/pass signup) but hasn't linked Google, link it
      user.googleId = googleId;
      await user.save();
    }

    // === FIX ===
    // Use the .env secret to match your Login.js file
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });
    
    console.log("Google user logged in:", user.email);
    res.redirect('http://localhost:5173/'); // Redirect to your frontend

  } catch (err) {
    console.error("OAuth error:", err.response?.data || err.message);
    res.status(500).json({ message: "OAuth login failed" });
  }
});

export default router;