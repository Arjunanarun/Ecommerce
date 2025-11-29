import React, { useEffect, useState } from "react";
// Assuming the CSS file is named "NewArrivals.css" as we've been working on
import "./NewArraival.css";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
const BaseUrl = import.meta.env.VITE_API_URL;
// --- KEY CHANGE 1: Added 'price' to all products ---


export default function NewArrivalSection() {

  const [latestProducts, setLatestProducts] = useState([]);

  const getLatestProducts = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/products`);
      const allProducts = response.data;

      const latest = allProducts;

      setLatestProducts(latest);
      console.log("Latest 4 products:", latest);
      console.log("image url", latest[0].images[0].url)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    getLatestProducts();
  }, [])
  return (
    <section className="na-section-container">
      <div className="na-section-header">
        <h2>New Arrivals</h2>
        {/* --- KEY CHANGE 2: Changed <button> to <a> --- */}
        {/* This matches the CSS we wrote for .view-more */}
        <a href="/catalogues" className="na-view-more">View all</a>
      </div>

      <div className="na-product-slider">
        {
          latestProducts.map((item, index) => (
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
        }
      </div>
    </section>
  );
}