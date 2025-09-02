import { useState, useRef, useCallback, useMemo } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";
import styles from "./SharedPagination.module.css";

function VirtualizedProductPagination() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, hasMore, loading, error, totalProducts } =
    useProductSearch(pageNumber);

  const observer = useRef();
  const containerRef = useRef();
  const [scrollTop, setScrollTop] = useState(0);

  // Simple virtualization settings
  const ITEM_HEIGHT = 320; // Height of each product card
  const ITEMS_PER_ROW = 4; // Items per row (can be made responsive later)
  const CONTAINER_HEIGHT = 600; // Visible container height
  const BUFFER = 2; // Extra rows to render above/below

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    const rowHeight = ITEM_HEIGHT;
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER);
    const endRow = Math.min(
      Math.ceil(products.length / ITEMS_PER_ROW) - 1,
      Math.floor((scrollTop + CONTAINER_HEIGHT) / rowHeight) + BUFFER
    );

    const startIndex = startRow * ITEMS_PER_ROW;
    const endIndex = Math.min(
      products.length - 1,
      (endRow + 1) * ITEMS_PER_ROW - 1
    );

    return { startIndex, endIndex, startRow, endRow };
  }, [scrollTop, products.length]);

  // Get only visible products
  const visibleProducts = useMemo(() => {
    return products.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [products, visibleRange]);

  // Calculate total height for scrolling
  const totalRows = Math.ceil(products.length / ITEMS_PER_ROW);
  const totalHeight = totalRows * ITEM_HEIGHT;

  // Handle scroll
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Intersection observer for infinite loading
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
        <h3 className={styles.title}>Simple Virtualized Scroll</h3>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div className={styles.methodInfo}>
          DOM contains only {visibleProducts.length} of {products.length}{" "}
          products
        </div>
        <div className={styles.methodInfo}>
          Visible range: {visibleRange.startIndex} - {visibleRange.endIndex}
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles.virtualizedContainer}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: visibleRange.startRow * ITEM_HEIGHT,
              left: 0,
              right: 0,
            }}
          >
            <div className={styles.productsGrid}>
              {visibleProducts.map((product, index) => {
                const actualIndex = visibleRange.startIndex + index;
                const isLastProduct = actualIndex === products.length - 5;

                return (
                  <div
                    key={product.id}
                    ref={isLastProduct ? lastProductElementRef : null}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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

export default VirtualizedProductPagination;
