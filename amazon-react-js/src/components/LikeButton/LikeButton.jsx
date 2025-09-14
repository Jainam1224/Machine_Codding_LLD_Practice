import { useState, useCallback } from "react";
import "./LikeButton.css";

export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onLikeChange,
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  const handleLike = useCallback(() => {
    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newLiked);
    setLikeCount(newCount);
    onLikeChange?.(newLiked, newCount);
  }, [isLiked, likeCount, onLikeChange]);

  return (
    <button
      className={`like-button ${isLiked ? "liked" : ""}`}
      onClick={handleLike}
    >
      <span className="like-icon">{isLiked ? "❤️" : "🤍"}</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
}
