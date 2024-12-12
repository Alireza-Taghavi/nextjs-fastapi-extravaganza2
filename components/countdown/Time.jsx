import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDateTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date(targetDateTime);
    const difference = target - now;

    return difference > 0 ? difference : 0; // Return time in milliseconds
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]); // Only reinitialize on targetDateTime change

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  return (
    <div>
      <h1>Countdown: {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}</h1>
    </div>
  );
};

export default Countdown;
