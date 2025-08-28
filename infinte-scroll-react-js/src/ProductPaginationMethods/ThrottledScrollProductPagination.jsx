import { useState, useEffect, useCallback, useRef } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";

function ThrottledScrollProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);
  const throttleTimeoutRef = useRef(null);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (throttleTimeoutRef.current) return; // Skip if throttled

    throttleTimeoutRef.current = setTimeout(() => {
      // Check if we're near the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
      ) {
        if (hasMore && !loading) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }
      throttleTimeoutRef.current = null;
    }, 300); // Increased throttle to 300ms for better reliability
  }, [hasMore, loading]);

  useEffect(() => {
    const scrollHandler = () => {
      // Check if we're near the bottom immediately (without throttling)
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
      ) {
        if (hasMore && !loading) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }
    };

    // Add both immediate and throttled handlers for better reliability
    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [handleScroll, hasMore, loading]);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>
          Throttled Scroll Method
        </h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Scroll down to automatically load more products (throttled for
          performance)
        </p>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#aaa" }}>
          Throttled to 300ms for better reliability
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#888" }}>
          Scroll threshold: 500px from bottom
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#888" }}>
          Current page: {pageNumber} | Has more: {hasMore ? "Yes" : "No"} |
          Loading: {loading ? "Yes" : "No"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          padding: "16px 0",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Loading more products...
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "12px",
            color: "#dc3545",
            backgroundColor: "#f8d7da",
            borderRadius: "4px",
            margin: "16px 0",
            fontSize: "14px",
          }}
        >
          Error loading products. Please try again.
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "12px",
            color: "#28a745",
            backgroundColor: "#d4edda",
            borderRadius: "4px",
            margin: "16px 0",
            fontSize: "14px",
          }}
        >
          All products loaded!
        </div>
      )}
    </div>
  );
}

export default ThrottledScrollProductPagination;
