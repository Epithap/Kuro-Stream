// src/components/RatingStars.jsx
import React from 'react';
import { Star } from 'lucide-react';
import './RatingStars.css';

const RatingStars = ({ rating }) => {
  if (!rating) return <span className="no-rating">MAL: N/A</span>;

  // Convert 10-point scale to 5-star scale
  const starsCount = (rating / 2).toFixed(1);
  const fullStars = Math.floor(starsCount);
  const hasHalfStar = starsCount % 1 >= 0.5;

  return (
    <div className="rating-stars-container" title={`Skor MAL: ${rating}/10`}>
      <div className="stars-row">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="star-icon filled" size={16} fill="currentColor" />;
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="half-star-wrapper">
                <Star className="star-icon empty" size={16} />
                <div className="half-star-overlay">
                  <Star className="star-icon filled" size={16} fill="currentColor" />
                </div>
              </div>
            );
          } else {
            return <Star key={i} className="star-icon empty" size={16} />;
          }
        })}
      </div>
      <span className="rating-text">{rating.toFixed(2)}</span>
    </div>
  );
};

export default RatingStars;
