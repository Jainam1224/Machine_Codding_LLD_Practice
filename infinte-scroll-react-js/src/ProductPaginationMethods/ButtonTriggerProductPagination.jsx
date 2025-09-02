import { useState } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./ButtonTriggerProductPagination.module.css";

function ButtonTriggerProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Button Trigger Method</h3>
        <p className={styles.description}>
          Click the button below to load more products
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? "Loading..." : "Load More Products"}
          </button>
        </div>
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

export default ButtonTriggerProductPagination;
