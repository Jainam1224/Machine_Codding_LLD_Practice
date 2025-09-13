import { useState, useCallback, useMemo } from "react";
import "./Rating.css";

export default function Rating({
  maxStars = 5,
  initialRating = 0,
  onRatingChange,
  readOnly = false,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = useCallback(
    (starValue) => {
      if (readOnly) return;
      setRating(starValue);
      onRatingChange?.(starValue);
    },
    [readOnly, onRatingChange]
  );

  const handleStarHover = useCallback(
    (starValue) => {
      if (readOnly) return;
      setHoverRating(starValue);
    },
    [readOnly]
  );

  const handleMouseLeave = useCallback(() => {
    if (readOnly) return;
    setHoverRating(0);
  }, [readOnly]);

  const displayRating = hoverRating || rating;

  const stars = useMemo(
    () =>
      Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <span
            key={index}
            className={`star ${isFilled ? "filled" : ""} ${
              readOnly ? "readonly" : ""
            }`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            role={readOnly ? "img" : "button"}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            tabIndex={readOnly ? -1 : 0}
          >
            ★
          </span>
        );
      }),
    [maxStars, displayRating, readOnly, handleStarClick, handleStarHover]
  );

  return (
    <div className="rating-container" role="radiogroup" aria-label="Rating">
      <div className="stars" onMouseLeave={handleMouseLeave}>
        {stars}
      </div>
      {rating > 0 && (
        <span className="rating-text" aria-live="polite">
          {rating} out of {maxStars} stars
        </span>
      )}
    </div>
  );
}
