import { useState, useRef, useCallback, useMemo } from "react";
import useProductSearch from "./useProductSearch";
import ProductCard from "./ProductCard";

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
          Virtualized Infinite Scroll
        </h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          Performance optimized - only renders visible products in DOM
        </p>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
          Showing {products.length} of {totalProducts} products
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#aaa" }}>
          DOM contains only {visibleProducts.length} product cards
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#aaa" }}>
          Visible rows: {visibleRange.startRow + 1} - {visibleRange.endRow + 1}
        </div>
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#aaa" }}>
          Total rows: {totalRows} | Items per row: {ITEMS_PER_ROW}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          height: CONTAINER_HEIGHT,
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          position: "relative",
          backgroundColor: "#fafafa",
        }}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: totalHeight,
            position: "relative",
          }}
        >
          {visibleProducts.map((product, index) => {
            const actualIndex = visibleRange.startIndex + index;
            const isLastProduct = actualIndex === products.length - 5;
            const position = getItemPosition(actualIndex);

            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductElementRef : null}
                style={{
                  position: "absolute",
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  height: ITEM_HEIGHT,
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
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

export default VirtualizedProductPagination;
