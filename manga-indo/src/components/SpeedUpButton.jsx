import React from 'react';
import { Zap } from 'lucide-react';
import './SpeedUpButton.css';

const SpeedUpButton = ({ animeId }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    // Simple feedback – can be replaced with toast library later
    alert('Anime dipercepat!');
  };

  return (
    <button className="speedup-btn" onClick={handleClick} aria-label="Speed up">
      <Zap size={16} />
    </button>
  );
};

export default SpeedUpButton;
