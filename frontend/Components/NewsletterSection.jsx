import React from "react";
 import { MdEmail } from 'react-icons/md';
import "./NewsletterSection.css";



const NewsletterSection = () => {
  return (
    // This is the outer wrapper that we will position
    <section className="newsletter-section">
      {/* This container has the gradient and content */}
      <div className="newsletter-container">
        
        <div className="newsletter-text">
          <h2>SUBSCRIBE TO OUR NEWSLETTER!</h2>
          <p>Get notified about news, webinars, & more</p>
        </div>

        <form className="newsletter-form">
          <div className="input-wrapper">
            {/* <MdEmail /> */}
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
              required
            />
          </div>
          <button type="submit">Subscribe</button>
        </form>

      </div>
    </section>
  );
};

export default NewsletterSection;