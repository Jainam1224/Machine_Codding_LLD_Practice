import { useState, useRef, useCallback } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";

function IntersectionObserverProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);

  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
          Intersection Observer Method
        </h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Most performant method - automatically loads when you reach the last
          product
        </p>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#aaa" }}>
          Uses Intersection Observer API for optimal performance
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
        {products.map((product, index) => {
          // Add ref to the last product to trigger intersection observer
          if (products.length - 5 === index + 1) {
            return (
              <div key={product.id} ref={lastProductElementRef}>
                <ProductCard product={product} />
              </div>
            );
          } else {
            return <ProductCard key={product.id} product={product} />;
          }
        })}
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

export default IntersectionObserverProductPagination;
