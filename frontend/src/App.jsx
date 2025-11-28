import React from "react";
import { Routes, Route,Navigate } from "react-router-dom";
import BasicRoutes from "../Routes/BasicRoutes";
import Login from "./Login";
import ForgetPassword from '../Components/ForgetPassword';
import { AuthProvider } from '../Context/AuthContext';
import DashBoard from '../Admin/DashBoard';
import UserDashboard from "../User/userDashboard";
import Catelogue from "./Catelogue";
import ProductCard from "../Components/ProductCard";
import {ToastContainer} from 'react-toastify';
import Admin from "../Admin/Admin";
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from "../Components/ProductDetail";
import MobileMenu from "../Components/MobileMenu";

export default function App() {
  return (
    <AuthProvider>

      {/* Show login always (if that's what you want) */}
      {/* <ProductCard/> */}
      <ToastContainer position="top-right" autoClose={5000}/>
      <Routes>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/" element={<BasicRoutes />} />
        <Route path="/fp" element={<ForgetPassword />} />
        <Route path="/admin" element={<Admin element={<DashBoard/>}/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/user" element={<UserDashboard/>}/>
        <Route path="/catalogues" element={<Catelogue />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="//" element={<MobileMenu/>}/>
      </Routes>

    </AuthProvider>
  );
}
