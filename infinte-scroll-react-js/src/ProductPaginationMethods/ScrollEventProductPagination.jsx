import { useState, useEffect, useCallback } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./SharedPagination.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Scroll Event Method</h3>
        <p className={styles.description}>
          Scroll down to automatically load more products
        </p>
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

export default ScrollEventProductPagination;
