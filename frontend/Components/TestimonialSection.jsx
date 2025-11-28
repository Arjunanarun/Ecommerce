import React from "react";
import "./TestimonialSection.css";

// --- Sample Data (with profile images) ---
const testimonialData = [
  {
    id: 1,
    author: "Priya Sharma", // Changed name for Indian context
    rating: 5,
    quote: "This is the only place I'll shop for maternity wear. The comfort and style are unmatched. The 'Everyday Comfort' line is a lifesaver!",
    profileImg: "https://images.unsplash.com/photo-1577717903102-fa6743953401?auto=format&fit=crop&w=100&h=100&q=80", // Example Indian profile image
  },
  {
    id: 2,
    author: "Rahul Gupta", // Changed name for Indian context
    rating: 5,
    quote: "My wife loved the Baby Shower Gown I bought for her. She looked stunning and said she felt so comfortable. 10/10.",
    profileImg: "https://images.unsplash.com/photo-1507003211169-e695c6ede616?auto=format&fit=crop&w=100&h=100&q=80", // Example Indian profile image
  },
  {
    id: 3,
    author: "Anjali Singh", // Changed name for Indian context
    rating: 4,
    quote: "Great quality and fast shipping. The nursing-friendly top is so practical and still looks fashionable. Will be buying more.",
    profileImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80", // Example Indian profile image
  },
  {
    id: 4,
    author: "Sanjay Verma", // Changed name for Indian context
    rating: 5,
    quote: "The maternity workwear is fantastic. It's so hard to find professional clothes that fit well. I finally feel confident in my meetings again.",
    profileImg: "https://images.unsplash.com/photo-1522075469751-3a6694fa2fa3?auto=format&fit=crop&w=100&h=100&q=80", // Example Indian profile image
  },
  {
    id: 5,
    author: "Pooja Desai", // Changed name for Indian context
    rating: 5,
    quote: "I bought a photoshoot gown and it was absolutely perfect. The fabric was so soft and flowed beautifully in my photos.",
    profileImg: "https://images.unsplash.com/photo-1549068106-b024baf5062d?auto=format&fit=crop&w=100&h=100&q=80", // Example Indian profile image
  },
];

// --- Helper Component for Star Ratings (unchanged) ---
const StarRating = ({ rating }) => {
  const stars = Array(5).fill(null);
  return (
    <div className="ts-star-rating">
      {stars.map((_, index) => (
        <span key={index} className={index < rating ? "ts-star-filled" : "ts-star-empty"}>
          ★
        </span>
      ))}
    </div>
  );
};


// --- Main Testimonial Section Component ---
const TestimonialSection = () => {
  return (
    <section className="ts-section-container">
      <div className="ts-section-header">
        <h2>The Word on Us</h2>
      </div>

      <div className="ts-testimonial-slider">
        {testimonialData.map((item) => (
          <div key={item.id} className="ts-testimonial-card">
            <StarRating rating={item.rating} />
            <p className="ts-quote-text">"{item.quote}"</p>

            {/* --- KEY CHANGE: Added profile image and wrapped author info --- */}
            <div className="ts-author-details">
              <img src={item.profileImg} alt={item.author} className="ts-profile-image" />
              <div className="ts-author-text">
                <span className="ts-author-name">{item.author}</span>
                <span className="ts-verified-badge">Verified Buyer</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;