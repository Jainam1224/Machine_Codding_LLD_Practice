import { useState, useEffect, useCallback, useMemo } from "react";
import "./WhatsAppLastSeen.css";

const WhatsAppLastSeen = () => {
  const [lastSeen, setLastSeen] = useState(new Date());
  const [relativeTime, setRelativeTime] = useState("");

  const formatRelativeTime = useCallback((date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  const updateTime = useCallback(() => {
    setRelativeTime(formatRelativeTime(lastSeen));
  }, [lastSeen, formatRelativeTime]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const updateLastSeen = useCallback(() => {
    setLastSeen(new Date());
  }, []);

  const userInfo = useMemo(
    () => ({
      name: "John Doe",
      avatar: "👤",
    }),
    []
  );

  return (
    <div className="whatsapp-container">
      <h2>WhatsApp Last Seen</h2>
      <div className="whatsapp-user-info">
        <div className="user-avatar" aria-hidden="true">
          {userInfo.avatar}
        </div>
        <div className="user-details">
          <div className="user-name">
            <strong>{userInfo.name}</strong>
          </div>
          <div className="last-seen" aria-live="polite">
            Last seen {relativeTime}
          </div>
        </div>
        <button
          className="update-button"
          onClick={updateLastSeen}
          aria-label="Update last seen time"
        >
          Update Last Seen
        </button>
      </div>
    </div>
  );
};

export default WhatsAppLastSeen;
