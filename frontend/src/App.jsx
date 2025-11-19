import React from "react";
import { Routes, Route } from "react-router-dom";
import BasicRoutes from "../Routes/BasicRoutes";
import Login from "./Login";
import ForgetPassword from '../Components/ForgetPassword';
import { AuthProvider } from '../Context/AuthContext';
import DashBoard from '../Admin/DashBoard';
import UserDashboard from "../User/userDashboard";
import Catelogue from "./Catelogue";

export default function App() {
  return (
    <AuthProvider>

      {/* Show login always (if that's what you want) */}
      {/* <ProductCard/> */}
    
      <Routes>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/" element={<BasicRoutes />} />
        <Route path="/fp" element={<ForgetPassword />} />
        <Route path="/admin" element={<DashBoard/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/user" element={<UserDashboard/>}/>
        <Route path="/catalogues" element={<Catelogue />} />
      </Routes>

    </AuthProvider>
  );
}
