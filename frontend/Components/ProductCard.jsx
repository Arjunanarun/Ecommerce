import React, { useState ,useEffect} from 'react';
import './ProductCard.css'; // Make sure to import the CSS file
import axios from 'axios';
const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";




const ProductCard = () => {


    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const productData = await axios.get(BaseUrl + "api/products", { withCredentials: true });
      console.log("product data in card component", productData.data[0]);
    } catch (err) {
      console.log("error in product card component", err.message);
    }
  };

  fetchProducts();
}, []);


    // State to track if the mouse is hovering over the card
    const [isHovering, setIsHovering] = useState(false);

    // Image URLs (replace with actual paths if needed)
    const mainImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=801763445284975-1000042481.jpg"; 
    const hoverImageUrl = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"; 

    // Determine which image to show based on the hover state
    const currentImage = isHovering ? hoverImageUrl : mainImageUrl;

    return (
        <div 
            className="product-card"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Image Container */}
            <div className="image-container">
                
                {/* Image element using the dynamically determined source */}
                <img 
                    src={currentImage} 
                    alt="Afrin Maternity Dress" 
                    className="product-image"
                />

                {/* Overlay Elements (Badges) */}
                <div className="badges">
                    <span className="badge discount">25% OFF</span>
                    <span className="badge bestseller">Best Sellers</span>
                </div>
                
                {/* Hover Button - visibility controlled by CSS based on isHovering */}
                <button 
                    className={`hover-button ${isHovering ? 'is-visible' : ''}`}
                    onClick={() => alert('Button Clicked!')} // Example action
                >
                    Click Me
                </button>
            </div>

            {/* Product Details */}
            <div className="product-details">
                <h3 className="product-title">Afrin Maternity Dress with center Zip</h3>
                <div className="price-info">
                    <span className="original-price">Rs. 3,199</span>
                    <span className="current-price">Rs. 2,399</span>
                    <span className="save-percent">Save 25%</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;