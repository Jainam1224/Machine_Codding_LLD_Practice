import { useState, useEffect } from "react";
import InfiniteScroll from "./InfiniteScroll";

const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    content: `This is the content for post number ${
      i + 1
    }. It contains some sample text to demonstrate infinite scrolling.`,
    author: `Author ${(i % 5) + 1}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  }));
};

export default function InfiniteScrollDemo() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    const initialItems = generateItems(50);
    setAllItems(initialItems);
  }, []);

  const handleLoadMore = (page, newItems) => {
    console.log(`Loading page ${page} with ${newItems.length} items`);

    // Simulate API delay
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Simulate reaching end of data
      if (page >= 5) {
        setHasMore(false);
      }
    }, 1000);
  };

  const renderItem = (item) => (
    <div className="post-item">
      <h4>{item.title}</h4>
      <p>{item.content}</p>
      <div className="post-meta">
        <span>By {item.author}</span>
        <span>•</span>
        <span>{item.date}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Infinite Scroll</h2>
      <p>Scroll down to load more items automatically</p>

      <InfiniteScroll
        items={allItems}
        itemsPerPage={10}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
        renderItem={renderItem}
      />
    </div>
  );
}
