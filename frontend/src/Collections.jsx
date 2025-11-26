import React from "react";
import "./Collections.css"; // Using your original CSS file name

// NEW: Data tailored for a maternity store
const maternityCollections = [
  {
    id: 1,
    name: "Lounge Wear",
    img: "https://momsever.in/cdn/shop/files/Blue-KnittedCotton-Maternity-Loungewear-Dress-1.jpg?v=1737468336", // Woman in white dress
    href: "/collections/loungewea",
  },
  {
    id: 2,
    name: "Feeding Pant Set",
    img: "https://m.media-amazon.com/images/I/81gFgVuYQmL._AC_UY1100_.jpg", // Mother and baby
    href: "/collections/feeding-pant-set",
  },
  {
    id: 3,
    name: "Feeding T-shirt",
    img: "https://m.media-amazon.com/images/I/81dPFZsfA0L._SX569_.jpg", // Soft fabric
    href: "/collections/feeding-t-shirt",
  },
  {
    id: 4,
    name: "Feeding Kurtis",
    img: "https://m.media-amazon.com/images/I/81EdvnYD+KL._SY741_.jpg", // Professional
    href: "/collections/feeding-kurtis",
  },
  {
    id: 5,
    name: "Maternity Kurtis",
    img: "https://momsbae.com/cdn/shop/files/DSC02085_d932e141-ba99-4f7a-a116-e99bf56e17d5.jpg?v=1749537662&width=493", // Elegant gown
    href: "/collections/maternity-kurtis",
  },
  {
    id: 6,
    name: "Long T shirt",
    img: "https://zeyo.in/cdn/shop/files/download_25041706-9164-4dea-952b-e87f2e94c712.jpg?v=1756114783&width=1946", // Cozy home
    href: "/collections/long-t-shirt",
  },
];

const Collections = () => {
  return (
    // Added ARIA attribute for accessibility
    <section className="collections" aria-labelledby="collection-heading">
      <div className="section-header">
        <h2 id="collection-heading">Shop by Category</h2>
        {/* CHANGED: This is now a link (<a>) for correct semantics */}
        <a href="/catalogues" className="view-more">
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