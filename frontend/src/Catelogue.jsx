import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import ProductCard from '../Components/ProductCard';
import './Catelogue.css';
import MobileNavbar from '../Components/Nav';

const Catelogue = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // Filter states
    const [availability, setAvailability] = useState({
        inStock: false,
        outOfStock: false
    });
    const [sizes, setSizes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    
    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState(null);
    
    // Mobile filter sidebar state
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const getAllProducts = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/products/");
            setProducts(response.data);
            setFilteredProducts(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log(error.message);
        }
    }

    // Apply filters
    useEffect(() => {
        let filtered = products;

        // Availability filter
        if (availability.inStock && !availability.outOfStock) {
            filtered = filtered.filter(product => product.inStock);
        } else if (!availability.inStock && availability.outOfStock) {
            filtered = filtered.filter(product => !product.inStock);
        }
        // If both are selected or both are unselected, show all

        // Size filter
        if (sizes.length > 0) {
            filtered = filtered.filter(product => 
                product.sizes && product.sizes.some(size => sizes.includes(size))
            );
        }

        // Price range filter
        filtered = filtered.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        setFilteredProducts(filtered);
    }, [products, availability, sizes, priceRange]);

    const handleSizeChange = (size) => {
        setSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const handleAvailabilityChange = (type) => {
        setAvailability(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const openMobileFilters = () => {
        setIsMobileFilterOpen(true);
    };

    const closeMobileFilters = () => {
        setIsMobileFilterOpen(false);
    };

    const applyMobileFilters = () => {
        closeMobileFilters();
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    // Filter sidebar component
    const FilterSidebar = ({ isMobile = false }) => (
        <div className={`filters-sidebar ${isMobile ? 'mobile-sidebar' : ''}`}>
            {isMobile && (
                <div className="mobile-sidebar-header">
                    <h3>FILTERS</h3>
                    <button className="close-sidebar-btn" onClick={closeMobileFilters}>
                        ×
                    </button>
                </div>
            )}
            
            {!isMobile && <h3 className='filters-title'>FILTERS</h3>}
            
            {/* Availability Filter Dropdown */}
            <div className='filter-dropdown'>
                <div 
                    className='dropdown-header'
                    onClick={() => toggleDropdown('availability')}
                >
                    <span>AVAILABILITY</span>
                    <span className={`dropdown-arrow ${openDropdown === 'availability' ? 'open' : ''}`}>▼</span>
                </div>
                {openDropdown === 'availability' && (
                    <div className='dropdown-content'>
                        <div className='filter-options'>
                            <label className='filter-option'>
                                <input 
                                    type="checkbox" 
                                    checked={availability.inStock}
                                    onChange={() => handleAvailabilityChange('inStock')}
                                />
                                <span className='checkmark'></span>
                                In Stock
                            </label>
                            <label className='filter-option'>
                                <input 
                                    type="checkbox" 
                                    checked={availability.outOfStock}
                                    onChange={() => handleAvailabilityChange('outOfStock')}
                                />
                                <span className='checkmark'></span>
                                Out of Stock
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Size Filter Dropdown */}
            <div className='filter-dropdown'>
                <div 
                    className='dropdown-header'
                    onClick={() => toggleDropdown('size')}
                >
                    <span>SIZE</span>
                    <span className={`dropdown-arrow ${openDropdown === 'size' ? 'open' : ''}`}>▼</span>
                </div>
                {openDropdown === 'size' && (
                    <div className='dropdown-content'>
                        <div className='size-options'>
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    className={`size-option ${sizes.includes(size) ? 'selected' : ''}`}
                                    onClick={() => handleSizeChange(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Range Filter Dropdown */}
            <div className='filter-dropdown'>
                <div 
                    className='dropdown-header'
                    onClick={() => toggleDropdown('price')}
                >
                    <span>PRICE</span>
                    <span className={`dropdown-arrow ${openDropdown === 'price' ? 'open' : ''}`}>▼</span>
                </div>
                {openDropdown === 'price' && (
                    <div className='dropdown-content'>
                        <div className='price-filter'>
                            <div className='price-inputs'>
                                <div className='price-input-group'>
                                    <label>Min</label>
                                    <input 
                                        type="number" 
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className='price-input'
                                    />
                                </div>
                                <div className='price-input-group'>
                                    <label>Max</label>
                                    <input 
                                        type="number" 
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                                        className='price-input'
                                    />
                                </div>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="10000" 
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className='price-slider'
                            />
                            <div className='price-display'>
                                Rs. {priceRange[0]} - Rs. {priceRange[1]}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Clear Filters Button */}
            <button 
                className='clear-filters-btn'
                onClick={() => {
                    setAvailability({ inStock: true, outOfStock: false });
                    setSizes([]);
                    setPriceRange([0, 10000]);
                }}
            >
                CLEAR ALL FILTERS
            </button>

            {isMobile && (
                <button 
                    className='apply-filters-btn'
                    onClick={applyMobileFilters}
                >
                    APPLY FILTERS
                </button>
            )}
        </div>
    );

    return (
        <>
            <MobileNavbar />
            
            <div className='catalogue-container'>
                {/* Desktop Sidebar Filters - 30% */}
                <FilterSidebar />

                {/* Products Grid - 70% */}
                <div className='products-grid-section'>
                    <div className='products-header'>
                        <h2 className='products-title'>All Products</h2>
                        <div className='header-right'>
                            <span className='products-count'>{filteredProducts.length} products</span>
                            {/* Mobile Filter Button */}
                            <button 
                                className='mobile-filter-btn'
                                onClick={openMobileFilters}
                            >
                                <span>FILTER</span>
                                <span className='filter-icon'>☰</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className='collection-container'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((item, index) => (
                                <ProductCard 
                                    key={index} 
                                    id={item._id} 
                                    image={item.images?.[0]?.url} 
                                    name={item.name} 
                                    price={item.price} 
                                    desc={item.description} 
                                    discountprice={item.discountPrice}
                                />
                            ))
                        ) : (
                            <div className='no-products'>
                                <p>No products found matching your filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Overlay */}
                {isMobileFilterOpen && (
                    <div className="mobile-filter-overlay" onClick={closeMobileFilters}>
                        <div className="mobile-filter-sidebar" onClick={(e) => e.stopPropagation()}>
                            <FilterSidebar isMobile={true} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Catelogue