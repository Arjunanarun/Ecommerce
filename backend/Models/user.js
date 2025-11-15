import mongoose from 'mongoose';
// 'bcrypt' is no longer needed here

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      // Password is required ONLY IF googleId is not present
      required: function () {
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    mobilenum: {
      type: String,
      // Mobile number is required ONLY IF googleId is not present
      required: function () {
        return !this.googleId;
      },
      trim: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    // --- THIS IS THE NEW FIELD ---
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Default all new users to NOT be admins
    },
    // -----------------------------
    // Your forget password fields
    otp: {
      type: String,
      default: null,
    },
    otp_expiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Removed the .pre('save') hook for hashing
// Removed the .matchPassword() method

// === THIS IS THE FIX ===
// Check if the model already exists before compiling it
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;