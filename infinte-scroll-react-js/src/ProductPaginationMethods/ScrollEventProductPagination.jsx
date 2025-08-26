import { useState, useEffect, useCallback } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";

function ScrollEventProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);

  const handleScroll = useCallback(() => {
    // Check if we're near the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 // 1000px threshold
    ) {
      if (hasMore && !loading) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
          Scroll Event Method
        </h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Scroll down to automatically load more products
        </p>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
          Showing {products.length} of {totalProducts} products
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

export default ScrollEventProductPagination;
