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

  // Virtualization settings
  const ITEM_HEIGHT = 320; // Height of each product card + gap
  const ITEMS_PER_ROW = 4; // Number of items per row in the grid
  const BUFFER_SIZE = 2; // Number of extra rows to render above/below visible area
  const CONTAINER_HEIGHT = 600; // Height of the scrollable container
  const ROW_HEIGHT = ITEM_HEIGHT;

  // Calculate visible range based on rows
  const visibleRange = useMemo(() => {
    const startRow = Math.max(
      0,
      Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE
    );
    const endRow = Math.min(
      Math.ceil(products.length / ITEMS_PER_ROW) - 1,
      Math.floor((scrollTop + CONTAINER_HEIGHT) / ROW_HEIGHT) + BUFFER_SIZE
    );

    const startIndex = startRow * ITEMS_PER_ROW;
    const endIndex = Math.min(
      products.length - 1,
      (endRow + 1) * ITEMS_PER_ROW - 1
    );

    return { startRow, endRow, startIndex, endIndex };
  }, [scrollTop, products.length]);

  // Get only the products that should be visible
  const visibleProducts = useMemo(() => {
    return products.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [products, visibleRange]);

  // Calculate total height for proper scrolling
  const totalRows = Math.ceil(products.length / ITEMS_PER_ROW);
  const totalHeight = totalRows * ROW_HEIGHT;

  // Handle scroll events
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

  // Calculate position for each item
  const getItemPosition = (index) => {
    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;
    return {
      top: row * ROW_HEIGHT,
      left: col * (100 / ITEMS_PER_ROW) + "%",
      width: 100 / ITEMS_PER_ROW + "%",
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Virtualized Infinite Scroll</h3>
        <p className={styles.description}>
          Performance optimized - only renders visible products in DOM
        </p>
        <div className={styles.productCount}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div className={styles.methodInfo}>
          DOM contains only {visibleProducts.length} product cards
        </div>
        <div className={styles.methodInfo}>
          Visible rows: {visibleRange.startRow + 1} - {visibleRange.endRow + 1}
        </div>
        <div className={styles.methodInfo}>
          Total rows: {totalRows} | Items per row: {ITEMS_PER_ROW}
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles.virtualizedContainer}
        onScroll={handleScroll}
      >
        <div
          className={styles.virtualizedContent}
          style={{ height: totalHeight }}
        >
          {visibleProducts.map((product, index) => {
            const actualIndex = visibleRange.startIndex + index;
            const isLastProduct = actualIndex === products.length - 5;
            const position = getItemPosition(actualIndex);

            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductElementRef : null}
                className={styles.virtualizedItem}
                style={{
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  height: ITEM_HEIGHT,
                }}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
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
