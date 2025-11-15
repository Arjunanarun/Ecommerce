import React from "react";
import { Routes, Route } from "react-router-dom";
import BasicRoutes from "../Routes/BasicRoutes";
import Login from "./Login";
import ForgetPassword from '../Components/ForgetPassword';
import { AuthProvider } from '../Context/AuthContext';
import DashBoard from '../Admin/DashBoard';
import UserDashboard from "../User/userDashboard";

export default function App() {
  return (
    <AuthProvider>

      {/* Show login always (if that's what you want) */}
      

      <Routes>
        <Route path="/" element={<BasicRoutes />} />
        <Route path="/fp" element={<ForgetPassword />} />
        <Route path="/admin" element={<DashBoard/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/user" element={<UserDashboard/>}/>
      </Routes>

    </AuthProvider>
  );
}
