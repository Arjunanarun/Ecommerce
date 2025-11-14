import React from 'react';
import './MobileMenu.css';
import { IoHomeOutline, IoSearchOutline, IoPersonOutline, IoCartOutline } from "react-icons/io5"; // Importing icons

// You can use React Router's <NavLink> here if you have it set up.
// For this example, I'll use regular <a> tags.

export default function MobileMenu() {
  return (
    <nav className="mobile-menu">
      <a href="/" className="menu-item">
        <IoHomeOutline className="menu-icon" />
        <span className="menu-text">Shop</span>
      </a>
      <a href="/search" className="menu-item">
        <IoSearchOutline className="menu-icon" />
        <span className="menu-text">Search</span>
      </a>
      <a href="/cart" className="menu-item">
        {/* You could add a badge here to show item count */}
        <IoCartOutline className="menu-icon" />
        <span className="menu-text">Cart</span>
      </a>
    
    </nav>
  );
}