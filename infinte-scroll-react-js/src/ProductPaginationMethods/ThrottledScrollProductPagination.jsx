import { useState, useEffect, useCallback, useRef } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./SharedPagination.module.css";

function ThrottledScrollProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);
  const throttleTimeoutRef = useRef(null);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    // Clear existing timeout
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }

    // Set new timeout
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
    }, 300); // Throttle to 300ms
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Throttled Scroll Method</h3>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
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
