import React from "react";
import { useState, useEffect } from "react";
import './Home.css';
import Hero from "./components/Hero";
import { BestSeller } from "./components/BestSeller";
import Category from "./components/Category";


export default function Home() {
  return (
    <>
    <div className="body">
         <Hero/>
      <Category/>
      <BestSeller/>
    </div>
    </>
  );
}