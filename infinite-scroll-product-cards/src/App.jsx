import { useCallback, useEffect, useRef, useState, memo } from "react";

// API configuration
const API_BASE_URL = "https://dummyjson.com/products";
const PRODUCTS_PER_PAGE = 20;

function useProductsFetch(pageNumber, limit = PRODUCTS_PER_PAGE) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = useCallback(
    async (abortController) => {
      try {
        if (abortController.signal.aborted) return;

        const response = await fetch(
          `${API_BASE_URL}?limit=${limit}&skip=${(pageNumber - 1) * limit}`,
          {
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ERROR! status: ${response.status}`);
        }

        const data = await response.json();
        const products = data.products || [];

        const prossedProducts = products.map((product, index) => ({
          id: `${pageNumber}-${product.id || index}`,
          title: product.title,
          price: product.price,
          image: product.thumbnail || product.image,
        }));

        setProducts((prevProducts) => {
          if (pageNumber === 1) {
            return prossedProducts;
          }
          return [...prevProducts, ...prossedProducts];
        });

        setTotalProducts(data.total);
        setLoading(false);
        setError(false);
        setRetryCount(0);
      } catch (error) {
        // Only check abort in catch block if we need to handle abort differently
        if (abortController.signal.aborted) {
          console.log("Request was aborted");
          return;
        }
        console.error("Fetch Error:", error.message);

        // Retry logic - retry up to 3 times
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            fetchProducts(abortController);
          }, 1000 * retryCount); // Exponential backoff
        } else {
          setError(true);
          setLoading(false);
        }
      }
    },
    [pageNumber, limit, retryCount]
  );

  useEffect(() => {
    setLoading(true);
    setError(false);
    const abortController = new AbortController();
    fetchProducts(abortController);

    return () => {
      abortController.abort();
    };
  }, [fetchProducts]);

  const calculatedHasMore = pageNumber * limit < totalProducts;

  return {
    products,
    loading,
    error,
    totalProducts,
    hasMore: calculatedHasMore,
  };
}

const ProductCard = memo(({ product }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        margin: "8px",
        maxWidth: "250px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          marginBottom: "8px",
        }}
      />
      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {product.title}
      </h3>
      <p
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          margin: "0",
          color: "#333",
        }}
      >
        ${product.price}
      </p>
    </div>
  );
});

function ProductCardsInfiniteScollEvent() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, loading, error, hasMore } = useProductsFetch(pageNumber);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 1000
    ) {
      if (!loading && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Product Cards Infinity Scroll
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading more products...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Error fetching products
        </div>
      )}

      {!hasMore && !loading && products.length > 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "green" }}>
          All Products Loaded
        </div>
      )}
    </div>
  );
}

function ProductCardsIntersectionObserver() {
  const [pageNumber, setPageNumber] = useState(1);
  const { products, loading, error, hasMore } = useProductsFetch(pageNumber);

  const observer = useRef();
  const lastProductRef = useCallback(
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Product Cards Infinity Scroll
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {products.map((product, index) => {
          // Add ref to the last product to trigger intersection observer
          if (products.length - 5 === index + 1) {
            return (
              <div key={product.id} ref={lastProductRef}>
                <ProductCard product={product} />
              </div>
            );
          }
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading more products...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Error fetching products
        </div>
      )}

      {!hasMore && !loading && products.length > 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "green" }}>
          All Products Loaded
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      {/* <ProductCardsInfiniteScollEvent /> */}
      <ProductCardsIntersectionObserver />
    </>
  );
}

export default App;
