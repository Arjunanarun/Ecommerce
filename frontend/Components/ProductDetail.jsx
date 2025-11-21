import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css';
import MobileNavbar from "./Nav";

const ProductDetail = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const currency = "₹";

  const availableSizes = ["S", "M", "L", "XL"];

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/products/${id}`
      );
      setProductData(response.data);
      if (response.data.images && response.data.images.length > 0) {
        setSelectedImage(response.data.images[0].url);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const addToCart = (productId, sizes) => {
    if (sizes.length === 0) {
      alert("Please select at least one size");
      return;
    }
    console.log("Add to cart:", productId, sizes);
    // Add your cart logic here
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="pd-error">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
      </div>
    );
  }

  return (
    <>
    <MobileNavbar />
    <div className="pd-wrapper">
      <div className="pd-main">
        {/* Product Images Section */}
        <div className="pd-images-section">
          {/* Thumbnail Images - Left Side */}
          <div className="pd-thumbnails">
            {productData.images?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(item.url)}
                className={`pd-thumbnail-btn ${
                  item.url === selectedImage ? "pd-thumbnail-active" : ""
                }`}
              >
                <img
                  src={`http://localhost:4000${item.url}`}
                  alt={`${productData.name} view ${index + 1}`}
                  className="pd-thumbnail-img"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="pd-main-image-container">
            {selectedImage && (
              <img
                src={`http://localhost:4000${selectedImage}`}
                className="pd-main-image"
                alt={productData.name}
              />
            )}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="pd-info-section">
          <h1 className="pd-title">{productData.name}</h1>
          
          <div className="pd-rating">
            <div className="pd-stars">★★★★★</div>
            <span className="pd-review-count">(122)</span>
          </div>

          <div className="pd-pricing">
            <span className="pd-current-price">
              {currency}
              {productData.price}
            </span>
          </div>

          <p className="pd-description">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="pd-size-section">
            <p className="pd-size-label">Select Size</p>
            <div className="pd-size-buttons">
              {availableSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => toggleSize(size)}
                  className={`pd-size-btn ${
                    selectedSizes.includes(size) ? "pd-size-btn-active" : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSizes.length > 0 && (
              <div className="pd-selected-sizes">
                Selected: {selectedSizes.join(", ")}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(productData._id, selectedSizes)}
            className={`pd-add-to-cart-btn ${
              selectedSizes.length === 0 ? "pd-add-to-cart-disabled" : ""
            }`}
            disabled={selectedSizes.length === 0}
          >
            Add To Cart
          </button>

          <div className="pd-extra-info">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Reviews Section */}
      <div className="pd-bottom-section">
        <div className="pd-tab-header">
          <button
            className={`pd-tab ${activeTab === "description" ? "pd-tab-active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`pd-tab ${activeTab === "reviews" ? "pd-tab-active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (122)
          </button>
        </div>
        
        <div className="pd-tab-content">
          {activeTab === "description" && (
            <>
              <p>
                Clara is your go-to destination for exquisite Indian Kurtis that
                blend traditional craftsmanship with contemporary fashion. Discover
                our wide range of elegant and comfortable kurtis designed to make
                you stand out on any occasion.
              </p>
              <p>
                Clara is your go-to destination for exquisite Indian Kurtis that
                blend traditional craftsmanship with contemporary fashion. Discover
                our wide range of elegant and comfortable kurtis designed to make
                you stand out on any occasion.
              </p>
            </>
          )}
          
          {activeTab === "reviews" && (
            <div className="pd-reviews-content">
              <p>Customer reviews will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;