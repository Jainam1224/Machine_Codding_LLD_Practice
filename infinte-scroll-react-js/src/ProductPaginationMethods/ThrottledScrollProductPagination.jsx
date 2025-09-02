import { useState, useEffect, useCallback, useRef } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./ThrottledScrollProductPagination.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Throttled Scroll Method</h3>
        <p className={styles.description}>
          Scroll down to automatically load more products (throttled for
          performance)
        </p>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div className={styles.throttleInfo}>
          Throttled to 300ms for better reliability
        </div>
        <div className={styles.scrollThreshold}>
          Scroll threshold: 500px from bottom
        </div>
        <div className={styles.debugInfo}>
          Current page: {pageNumber} | Has more: {hasMore ? "Yes" : "No"} |
          Loading: {loading ? "Yes" : "No"}
        </div>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div className={styles.loadingMessage}>Loading more products...</div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          Error loading products. Please try again.
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className={styles.successMessage}>All products loaded!</div>
      )}
    </div>
  );
}

export default ThrottledScrollProductPagination;
