import React, { useState, useEffect } from "react";
import { Menu, X, Search, Instagram, User } from "lucide-react";
import { IoHomeOutline, IoSearchOutline, IoPersonOutline, IoCartOutline, IoLogoInstagram } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./Nav.css";

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* Left - Hamburger for mobile */}
        {isMobile && (
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={26} />
          </button>
        )}

        {/* Center - Logo or Links */}
        {isMobile ? (
          <div className="nav-logo">MaternityHub</div>
        ) : (
          <>
            <div className="nav-logo">MaternityHub</div>
            <div className="nav-center-links">
              <Link to="/">Home</Link>
              <Link to="/new-arrivals">New Arrivals</Link>
              <Link to="/catalogues">Catalogues</Link>
              <Link to="/account">Login / Account</Link>
            </div>
          </>
        )}

        {/* Right - Search + Icon (Instagram or Profile) */}
        <div className="nav-icons">
            <Link to="/profile" className="icon">
              <IoPersonOutline size={24} 
                color="green"
              />
            </Link>
        </div>
      </nav>

      {/* --- MOBILE SLIDE MENU (85% HEIGHT) --- */}
      {isMobile && (
        <div
          className={`menu-overlay ${menuOpen ? "show" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="side-menu"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <div className="overlay-header">
              <h2 className="overlay-title">Menu</h2>
              <button className="close-btn" onClick={() => setMenuOpen(false)}>
                <X size={26} />
              </button>
            </div>

            <div className="overlay-links">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/new-arrivals" onClick={() => setMenuOpen(false)}>
                New Arrivals
              </Link>
              <Link to="/catalogues" onClick={() => setMenuOpen(false)}>
                Catalogues
              </Link>
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                Login / Account
              </Link>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-link"
                onClick={() => setMenuOpen(false)}
              >
                <IoLogoInstagram size={20} /> Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL-SCREEN SEARCH OVERLAY --- */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-header">
          <input
            type="text"
            placeholder="Search maternity dresses..."
            className="search-bar"
            autoFocus
          />
          <button className="close-btn" onClick={() => setSearchOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <div className="search-results">
          <p style={{ color: "#666" }}>Search results will appear here...</p>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
