import React from "react";
// Assuming the CSS file is named "NewArrivals.css" as we've been working on
import "./NewArraival.css"; 

// --- KEY CHANGE 1: Added 'price' to all products ---
const products = [
  {
    id: 4,
    name: "Party Maxi Dress",
    desc: "Flowy design with premium fabric for events.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 3,199.00",
  },
  {
    id: 5,
    name: "White Linen Dress",
    desc: "Lightweight and breathable — perfect for summer.",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 2,499.00",
  },
  {
    id: 6,
    name: "Printed Cotton Dress",
    desc: "Soft cotton material with a playful print.",
    img: "https://images.unsplash.com/photo-1520975918319-9d6c1c2f046b?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 1,899.00",
  },
  {
    id: 7,
    name: "Chiffon Layered Dress",
    desc: "Elegant layers add movement and charm.",
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 2,999.00",
  },
  {
    id: 1,
    name: "Floral Summer Dress",
    desc: "Elegant floral pattern for your casual outings.",
    img: "https://images.unsplash.com/photo-1520962918287-7448c2878f65?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 2,299.00",
  },
  {
    id: 2,
    name: "Evening Gown",
    desc: "Graceful satin finish with minimalist design.",
    img: "https://images.unsplash.com/photo-1588741068919-9b788a1a0e2d?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 4,599.00",
  },
  {
    id: 3,
    name: "Casual Denim Dress",
    desc: "Classic denim comfort meets modern chic.",
    img: "https://images.unsplash.com/photo-1542060748-10c28b62716e?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 2,699.00",
  },
  {
    id: 8,
    name: "Modern Shirt Dress",
    desc: "A versatile pick for both office and leisure.",
    img: "https://images.unsplash.com/photo-1618354691373-d851c097f3af?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 2,399.00",
  },
  {
    id: 9,
    name: "Boho Maxi Dress",
    desc: "Laid-back bohemian vibe with earthy tones.",
    img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 3,199.00",
  },
  {
    id: 10,
    name: "Velvet Cocktail Dress",
    desc: "Luxury meets comfort in this bold velvet style.",
    img: "https://images.unsplash.com/photo-1603575448360-5a4acb7e41db?auto=format&fit=crop&w=800&q=80",
    price: "Rs. 3,499.00",
  },
];

export default function NewArrivalSection() {
  return (
    <section className="new-arrivals">
      <div className="section-header">
        <h2>New Arrivals</h2>
        {/* --- KEY CHANGE 2: Changed <button> to <a> --- */}
        {/* This matches the CSS we wrote for .view-more */}
        <a href="/products" className="view-more">View all</a>
      </div>

      <div className="product-slider">
        {products.map((item) => (
          // --- KEY CHANGE 3: Changed <div> to <a> ---
          // This makes the whole card clickable and matches our CSS
          <a
            href={`/product/${item.id}`} // Example link
            key={item.id}
            className="product-card"
          >
            <img src={item.img} alt={item.name} />
            
            {/* --- KEY CHANGE 4: Added .product-info wrapper --- */}
            {/* This wrapper is required by our CSS */}
            <div className="product-info">

              {/* --- KEY CHANGE 5: Using <h3> for Description --- */}
              {/* Our CSS clamps <h3> to 2 lines, so we put 'desc' here */}
              <h3>{item.desc}</h3>

              {/* --- KEY CHANGE 6: Using <p> for Price --- */}
              {/* Our CSS makes <p> bold, so we put 'price' here */}
              <p>{item.price}</p>
              
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}