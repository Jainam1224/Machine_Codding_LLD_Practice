import { useState, useRef, useCallback } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./SharedPagination.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Intersection Observer Method</h3>
        <p className={styles.description}>
          Most performant method - automatically loads when you reach the last
          product
        </p>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div className={styles.methodInfo}>
          Uses Intersection Observer API for optimal performance
        </div>
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
    </div>
  );
}

export default IntersectionObserverProductPagination;
