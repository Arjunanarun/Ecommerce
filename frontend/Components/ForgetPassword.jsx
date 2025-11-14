import React, { useState } from "react";
import axios from "axios";
import "./ForgetPassword.css"; // Import the CSS file

const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const cleanUrl = (path) => {
    // Joins the BaseUrl and path, removing any double slashes
    return `${BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  // ===== STEP 1: Send OTP =====
  const sendOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      // Use the 'forgotpassword' route from your Login.js
      const res = await axios.post(cleanUrl("/login/forgotpassword"), { email });
      setMessage(res.data.message || "OTP sent successfully!");
      setStep(2); // Move to OTP step
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to send OTP."
      );
    }
  };

  // ===== STEP 2: Verify OTP =====
  const verifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      // Use the 'verifyotp' route
      const res = await axios.post(cleanUrl("/login/verifyotp"), { email, otp });
      setMessage(res.data.message || "OTP verified! Please set a new password.");
      setStep(3); // Move to new password step
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Invalid or expired OTP."
      );
    }
  };

  // ===== STEP 3: Reset Password =====
  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      // Use the 'resetpassword' route
      const res = await axios.post(cleanUrl("/login/resetpassword"), {
        email,
        newPassword,
      });

      setMessage("Password reset successful! Redirecting to login...");
      
      setTimeout(() => {
        // Redirect to your main login page
        window.location.href = "/login"; 
      }, 2000);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  };

  // Helper to determine message style
  const messageStyle = {
    marginTop: "15px",
    fontWeight: "bold",
    color: isError ? "#e74c3c" : "#2ecc71", // Red for error, Green for success
  };

  return (
    <div className="container">
      <div className="card">
        
        {/* ===== Step 1: Enter Email ===== */}
        {step === 1 && (
          <form onSubmit={sendOTP} className="form">
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <button type="submit" className="button">
              Send OTP
            </button>
          </form>
        )}

        {/* ===== Step 2: Enter OTP ===== */}
        {step === 2 && (
          <form onSubmit={verifyOTP} className="form">
            <h2>Enter OTP</h2>
            <p>An OTP has been sent to {email}</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
            />
            <button type="submit" className="button">
              Verify OTP
            </button>
          </form>
        )}

        {/* ===== Step 3: New Password ===== */}
        {step === 3 && (
          <form onSubmit={resetPassword} className="form">
            <h2>Set New Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
            <button type="submit" className="button">
              Reset Password
            </button>
          </form>
        )}

        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;