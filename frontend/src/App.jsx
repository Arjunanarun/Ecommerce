import React from "react";
import { Routes, Route } from "react-router-dom";
import BasicRoutes from "../Routes/BasicRoutes";
import Login from "./Login";
import ForgetPassword from '../Components/ForgetPassword';
import { AuthProvider } from '../Context/AuthContext';

export default function App() {
  return (
    <AuthProvider>

      {/* Show login always (if that's what you want) */}
      <Login />

      <Routes>
        <Route path="/" element={<BasicRoutes />} />
        <Route path="/fp" element={<ForgetPassword />} />
      </Routes>

    </AuthProvider>
  );
}
