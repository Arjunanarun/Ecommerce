import React, { useContext } from 'react';
import './MobileMenu.css';
import { 
    IoHomeOutline, 
    IoSearchOutline, 
    IoPersonOutline, 
    IoCartOutline, 
    IoPersonAddSharp,
    IoPerson // Assuming this is the filled icon for logged-in users
} from "react-icons/io5"; 
import { Link } from 'react-router-dom'; // Using Link for proper routing
import { AuthContext } from '../Context/AuthContext'; // Must be defined

export default function MobileMenu() {
    
    // 1. Context Consumption
    const { user } = useContext(AuthContext);
    
    // 💡 Dummy Cart Count (Replace with useContext(CartContext).itemCount)
    const cartItemCount = 3; 

    // Helper variables for clean JSX
    const isLoggedIn = !!user;
    const accountLink = isLoggedIn ? "/user" : "/login";
    const accountText = isLoggedIn ? "Account" : "Login";

    // Set the Logged In icon to the filled IoPerson icon for visual distinction
    const LoggedInIcon = IoPerson;
    
    return (
        <nav className="mobile-menu">
            
            {/* 1. Shop (Home) Link */}
            <Link to="/" className="menu-item">
                <IoHomeOutline className="menu-icon" />
                <span className="menu-text">Shop</span>
            </Link>
            
            {/* 2. Search Link */}
            <Link to="/search" className="menu-item">
                <IoSearchOutline className="menu-icon" />
                <span className="menu-text">Search</span>
            </Link>
            
            {/* 3. Profile/Login Link */}
            <Link to={accountLink} className={`menu-item ${isLoggedIn ? 'is-logged-in' : ''}`}>
                {isLoggedIn 
                    ? <LoggedInIcon className="menu-icon" /> 
                    : <IoPersonAddSharp className='menu-icon' />
                }
                <span className="menu-text">{accountText}</span>
            </Link>

            {/* 4. Cart Link with Badge */}
            <Link to="/cart" className="menu-item cart-item">
                <div className="cart-icon-wrapper"> 
                    <IoCartOutline className="menu-icon" />
                    {cartItemCount > 0 && (
                        <span className='cart-count'>{cartItemCount}</span>
                    )}
                </div>
                <span className="menu-text">Cart</span>
            </Link>
        </nav>
    );
}