import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "./HeroSlider.css";
import banner1 from '../assets/bannerImages/banner1.jpg';
import banner2 from '../assets/bannerImages/banner2.jpg';
import banner3 from '../assets/bannerImages/banner3.jpg';
import banner4 from '../assets/bannerImages/banner4.jpg';
import banner5 from '../assets/bannerImages/banner5.jpg';


const images = [
  banner1, // Woman in fashion outfit
  banner2, // Clothing rack
  banner3, // Man wearing jacket
  banner4, // Shoes & accessories
  banner5, // Modern fashion store interior
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
