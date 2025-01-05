import React from 'react';
import './HeartRain.css';

const HeartRain = () => {
  const hearts = Array.from({ length: 50 }); // Adjust the number for more or fewer hearts

  return (
    <div className="heart-rain overflow-x-hidden">
      {hearts.map((_, index) => {
        const randomDuration = 1 + Math.random() * 6; // Random duration between 1s and 3s
        const randomLeft = Math.random() * 100; // Random left position between 0% and 100%
        return (
          <span
            key={index}
            className="heart"
            style={{
              animationDuration: `${randomDuration}s`,
              left: `${randomLeft}%`,
            }}
          >💗
          </span>
        );
      })}
    </div>
  );
};

export default HeartRain;
