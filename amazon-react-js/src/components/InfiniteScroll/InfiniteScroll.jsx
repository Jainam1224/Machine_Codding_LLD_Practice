import { useState, useEffect, useRef, useCallback } from "react";
import "./InfiniteScroll.css";

export default function InfiniteScroll({
  items,
  itemsPerPage = 10,
  onLoadMore,
  hasMore = true,
  loading = false,
  renderItem,
}) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef();
  const loadingRef = useRef();

  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);

    setDisplayedItems((prev) => [...prev, ...newItems]);
    setCurrentPage((prev) => prev + 1);

    if (onLoadMore) {
      onLoadMore(currentPage + 1, newItems);
    }
  }, [items, currentPage, itemsPerPage, loading, hasMore, onLoadMore]);

  useEffect(() => {
    setDisplayedItems(items.slice(0, itemsPerPage));
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadMoreItems, hasMore, loading]);

  return (
    <div className="infinite-scroll-container">
      <div className="items-list">
        {displayedItems.map((item, index) => (
          <div key={index} className="item">
            {renderItem ? renderItem(item, index) : item}
          </div>
        ))}
      </div>

      <div ref={loadingRef} className="loading-trigger">
        {loading && (
          <div className="loading-spinner">Loading more items...</div>
        )}
        {!hasMore && displayedItems.length > 0 && (
          <div className="end-message">No more items to load</div>
        )}
      </div>
    </div>
  );
}
