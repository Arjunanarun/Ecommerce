import React from 'react'
import './ProductCard.css'
import { Link } from 'react-router-dom';

const ProductCard = ({ id, image, name, price, desc,  isBestSeller = true }) => {
    // Sample data - you can replace these with actual props
    const oldPrice = 3000; // sample
    const discount = 24; // sample
    
    return (
        <Link to={`/product/${id}`} className='product-card'>
            <div className='product-img-wrapper'>
                {/* Discount badge */}
                <div className="discount-badge">{discount}% OFF</div>
                
                {/* Best Seller tag */}
                {isBestSeller && <div className="best-seller-tag">Best Seller</div>}
                
                <img src={`http://localhost:4000${image}`} alt={name} className='product-img' />
            </div>

            
            {/* Product title */}
            <p className='product-title'>{name}</p>

            {/* Price row */}
            <div className="price-row">
                <span className="old-price">Rs. {oldPrice}</span>
                <span className="new-price">Rs. {price}</span>
                <span className="save">Save {discount}%</span>
            </div>
        </Link>
    )
}

export default ProductCard