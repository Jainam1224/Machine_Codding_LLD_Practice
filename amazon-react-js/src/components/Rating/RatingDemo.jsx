import { useState } from "react";
import Rating from "./Rating";

export default function RatingDemo() {
  const [currentRating, setCurrentRating] = useState(0);

  const handleRatingChange = (rating) => {
    setCurrentRating(rating);
    console.log(`Rating changed to: ${rating}`);
  };

  return (
    <div>
      <h2>Rating</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Rating onRatingChange={handleRatingChange} />
        <p>Current rating: {currentRating} out of 5 stars</p>
      </div>
    </div>
  );
}
