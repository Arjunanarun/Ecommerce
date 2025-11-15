import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Store the entire auth object { token, user }
  const [auth, setAuth] = useState(null);

  // --- NEW: Load auth state from localStorage on app start ---
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    console.log("AuthContext: localStorage auth:", storedAuth);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        console.log("AuthContext: parsedAuth:", parsedAuth);
        if (parsedAuth && parsedAuth.token && parsedAuth.user) {
          setAuth(parsedAuth);
          console.log("AuthContext: Restored user from localStorage", parsedAuth.user);
        }
      } catch (e) {
        console.error("AuthContext: Failed to parse auth from localStorage", e);
        localStorage.removeItem("auth");
      }
    }
  }, []); // Empty array means this runs only once on mount

  // --- UPDATED: login function ---
  // It now accepts the authData object { token, user } from Login.jsx
  const login = (authData) => {
    console.log("AuthContext: Logging in user", authData);
    setAuth(authData);
    // Save to localStorage for persistence
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  // --- UPDATED: logout function ---
  const logout = () => {
    console.log("AuthContext: Logging out");
    setAuth(null);
    // Remove from localStorage
    localStorage.removeItem("auth");
  };

  // The value provided to all children components
  const value = {
    user: auth?.user, // Provide the user object
    token: auth?.token, // Provide the token
    login,
    logout,
  };
  console.log("AuthContext: value provided to children:", value);

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}