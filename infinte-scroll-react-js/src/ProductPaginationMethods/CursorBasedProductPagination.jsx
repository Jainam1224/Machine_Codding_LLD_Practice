import { useState, useRef, useCallback } from "react";
import useProductSearchCursor from "./useProductSearchCursor";
import ProductCard from "./ProductCard";
import styles from "./SharedPagination.module.css";

function CursorBasedProductPagination() {
  const [cursor, setCursor] = useState(null);
  const {
    products,
    hasMore,
    loading,
    error,
    totalProducts,
    nextCursor,
    resetPagination,
  } = useProductSearchCursor(cursor);

  const observer = useRef();

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && nextCursor) {
          setCursor(nextCursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, nextCursor]
  );

  const handleReset = () => {
    setCursor(null);
    resetPagination();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Cursor-Based Pagination with Intersection Observer
        </h3>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
        </div>
        <button
          onClick={handleReset}
          className={styles.resetButton}
          disabled={loading}
        >
          Reset Pagination
        </button>
      </div>

      <div className={styles.productsGrid}>
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

      {cursor && (
        <div className={styles.cursorInfo}>Current cursor: {cursor}</div>
      )}
    </div>
  );
}

export default CursorBasedProductPagination;
