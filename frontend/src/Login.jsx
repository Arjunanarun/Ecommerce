import React, { useContext, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from "react-router-dom";


// Hardcoding the BaseUrl to fix the 'import.meta' issue
const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/";
// --- SVG Icons ---
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.56-2.05 3.38v2.8h3.58c2.08-1.92 3.28-4.74 3.28-8.17z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.8c-.98.66-2.23 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.5H2.04v2.88C3.87 20.98 7.6 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.03H2.04C1.35 8.41.96 10.14.96 12s.39 3.59 1.08 4.97l3.8-2.88z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.6 1 3.87 3.02 2.04 6.85l3.8 2.88c.87-2.57 3.3-4.5 6.16-4.5z" />
    </svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
// --- End Icons ---


const Login = () => {
    // true = Sign In view, false = Sign Up view
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();

    const [password, setPass] = useState("");
    const [mobilenum, setMobilenum] = useState("");
    const [email, setEmail] = useState("");
    const [mess, setmess] = useState("");

    // Assuming login function is provided by context to set auth state
    const { login } = useContext(AuthContext);

    // This function is for SIGNING UP
    const handleSignUp = async (e) => {
        e.preventDefault();
        setmess("");
        try {
            // Post to /register to match your server.js
            const res = await axios.post(BaseUrl + "register", {
                email,
                mobilenum,
                password,
            }, { withCredentials: true });

            // Your /register route sends a simple string like "super registered"
            console.log("Success:", res.data);
            setmess("Signup successful! Please log in.");
            setIsLoginView(true); // Flip to login view

            // Clear inputs
            setEmail("");
            setPass("");
            setMobilenum("");

        } catch (err) {
            // === THIS IS THE FIX ===
            // Safely get the error message
            // 1. Try to get the error from the server's response
            // 2. If no response (network error), use the general error message
            let errorMsg = "An error occurred. Please try again.";
            if (err.response && err.response.data) {
                // Your register route sends a string or { message: "..." }
                errorMsg = err.response.data.message || err.response.data;
            }
            console.log("error Occured", errorMsg);
            setmess(errorMsg);
        }
    }

    // This function is for LOGGING IN
    const handleLogin = async (e) => {
        e.preventDefault();
        setmess("");
        try {
            // Post to /login to match your server.js
            const res = await axios.post(BaseUrl + "login", {
                email,
                password,
            }, { withCredentials: true });

            // Your login route (the corrected one) returns { token, user }
            login(res.data); // Pass { token, user } to context
            console.log("the response is", res.data.token);
            // Redirect based on admin status
            if (res.data.user && res.data.user.isAdmin) {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (err) {
            // === THIS IS THE FIX ===
            // Safely get the error message
            let errorMsg = "Invalid email or password";
            if (err.response && err.response.data) {
                // Your login route sends { error: "..." }
                errorMsg = err.response.data.error || err.response.data.message;
            }
            console.log("error Occured", errorMsg);
            setmess(errorMsg);
        }
    }

    const Oauth = () => {
        // We go to the backend route, which will redirect to Google
        window.location.href = BaseUrl + "auth/google";
    }

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setmess(""); // Clear errors
        setEmail("");
        setPass("");
        setMobilenum("");
    }

    return (
        <div className="auth-page">
            <div className="auth-header"></div>

            <div className="auth-content">
                <div className="auth-card">
                    <h2>{isLoginView ? 'Sign in' : 'Sign up'}</h2>

                    {/* Use the correct submit handler based on the view */}
                    <form className="auth-form" onSubmit={isLoginView ? handleLogin : handleSignUp}>
                        <div className="input-group">
                            <input
                                type='email'
                                placeholder='Enter email'
                                required={true}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Only show Phone Number field in "Sign Up" view */}
                        {!isLoginView && (
                            <div className="input-group">
                                <input
                                    type='number'
                                    placeholder='Enter Mobile Number'
                                    required={true}
                                    value={mobilenum}
                                    onChange={(e) => setMobilenum(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <input
                                type='password'
                                placeholder='Enter Password'
                                required={true}
                                value={password}
                                onChange={(e) => setPass(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="auth-button">
                            {isLoginView ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Updated to show success messages in green */}
                    {mess && <p className={mess.includes("successful") ? "success-message" : "error-message"}>{mess}</p>}

                    {isLoginView ? (
                        <span
                            className="forgot-password"
                            onClick={() => navigate("/fp")}
                            style={{ cursor: "pointer" }}
                        >
                            Forgot your password?
                        </span>

                    ) : (
                        <p className="terms">
                            By clicking this button, you agree with our <a href="#">Terms and Conditions</a>
                        </p>
                    )}
                </div>

                <div className="social-logins">
                    <button className="social-btn google" onClick={Oauth}>
                        <GoogleIcon />
                        <span>Google</span>
                    </button>
                    <button className="social-btn facebook">
                        <FacebookIcon />
                        <span>Facebook</span>
                    </button>
                </div>

                <div className="auth-toggle">
                    <p>
                        {isLoginView ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={toggleView}>
                            {isLoginView ? 'Sign up' : 'Sign in'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;