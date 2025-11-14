import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "./HeroSlider.css";

const images = [
  "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80", // Woman in fashion outfit
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80", // Clothing rack
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80", // Man wearing jacket
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80", // Shoes & accessories
  "https://images.unsplash.com/photo-1520975918318-3a29f5b9e8a5?auto=format&fit=crop&w=1600&q=80", // Modern fashion store interior
];


export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Auto-slide setup
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide(); // clear old timer
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const nextSlide = () => {
    stopAutoSlide();
    setCurrent((prev) => (prev + 1) % images.length);
    startAutoSlide();
  };

  const prevSlide = () => {
    stopAutoSlide();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    startAutoSlide();
  };

  return (
    <div className="hero-slider">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="slider-overlay">
        <h1>Shop the Best Products</h1>
        <p>Fresh deals every day</p>
      </div>

      <button className="nav-btn prev" onClick={prevSlide}>
         <ChevronLeft size={46}/>
      </button>
      <button className="nav-btn next" onClick={nextSlide}>
        <ChevronRight size={46}/>
      </button>

      <div className="dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active-dot" : ""}`}
            onClick={() => {
              stopAutoSlide();
              setCurrent(idx);
              startAutoSlide();
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
