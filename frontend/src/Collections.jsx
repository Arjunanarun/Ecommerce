import React from "react";
import "./Collections.css"; // Using your original CSS file name

// NEW: Data tailored for a maternity store
const maternityCollections = [
  {
    id: 1,
    name: "Baby Shower",
    img: "https://images.unsplash.com/photo-1599380333606-96de95a09289", // Woman in white dress
    href: "/collections/baby-shower",
  },
  {
    id: 2,
    name: "Nursing Friendly",
    img: "https://images.unsplash.com/photo-1611034237746-2c96c56d2b2c", // Mother and baby
    href: "/collections/nursing-friendly",
  },
  {
    id: 3,
    name: "Everyday Comfort",
    img: "https://images.unsplash.com/photo-1542385152-80261b60yea6", // Soft fabric
    href: "/collections/everyday-comfort",
  },
  {
    id: 4,
    name: "Maternity Workwear",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678", // Professional
    href: "/collections/workwear",
  },
  {
    id: 5,
    name: "Photoshoot Gowns",
    img: "https://images.unsplash.com/photo-1519013552093-b5b0f5b0f445", // Elegant gown
    href: "/collections/photoshoot",
  },
  {
    id: 6,
    name: "Loungewear",
    img: "https://images.unsplash.com/photo-1575424909138-46b05e5919ec", // Cozy home
    href: "/collections/loungewear",
  },
];

const Collections = () => {
  return (
    // Added ARIA attribute for accessibility
    <section className="collections" aria-labelledby="collection-heading">
      <div className="section-header">
        <h2 id="collection-heading">Shop by Category</h2>
        {/* CHANGED: This is now a link (<a>) for correct semantics */}
        <a href="/collections" className="view-more">
          View More →
        </a>
      </div>

      <div className="collection-slider">
        {maternityCollections.map((col) => (
          // CHANGED: The entire card is now a link
          <a
            href={col.href}
            className="collection-card"
            key={col.id}
            aria-label={`Shop the ${col.name} collection`}
          >
            <img
              src={col.img}
              alt={col.name}
              loading="lazy" // NEW: Improves performance
            />
            <h3>{col.name}</h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Collections;