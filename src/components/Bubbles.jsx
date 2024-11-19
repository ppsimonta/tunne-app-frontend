import React from 'react';
import './Bubbles.css'; // Import the CSS file for styling

function Bubbles({ colors }) {
  // Calculate total number of bubbles
  const totalBubbles = colors.reduce((sum, color) => sum + color.amount, 0);

  // Generate an array of bubbles with random properties and colors
  const bubbles = Array.from({ length: totalBubbles }, (_, index) => {
    const totalColors = colors.reduce((arr, color) => {
      return [...arr, ...Array(color.amount).fill(color.color)];
    }, []);
    return {
      id: index,
      size: Math.random() * 40 + 10, // Random size between 10 and 50
      left: Math.random() * 100,     // Random horizontal position
      delay: Math.random() * 10,      // Random animation delay
      duration: Math.random() * 10 + 10, // Random animation duration between 5 and 10 seconds
      color: totalColors[index % totalColors.length],
    };
  });

  return (
    <>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            backgroundColor: bubble.color
          }}
        />
      ))}
    </>
  );
}

export default Bubbles;
