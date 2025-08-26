import { useState, useEffect, useCallback, useRef } from "react";
import useBookSearch from "./useBookSearch";

function ThrottledScrollBookSearch() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const throttleTimeoutRef = useRef(null);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const handleScroll = useCallback(() => {
    if (throttleTimeoutRef.current) return;

    throttleTimeoutRef.current = setTimeout(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 800
      ) {
        if (hasMore && !loading) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }
      throttleTimeoutRef.current = null;
    }, 150);
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

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
          Throttled Scroll Method
        </h3>
        <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
          Scroll down to load more books (throttled for performance)
        </p>
        <input
          type="text"
          value={query ?? ""}
          onChange={handleSearch}
          placeholder="Search for books..."
          style={{
            padding: "6px 10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "200px",
            fontSize: "14px",
          }}
        />
      </div>

      <div>
        {books.map((book, index) => (
          <div
            key={`${book}-${index}`}
            style={{
              padding: "6px 0",
              borderBottom: "1px solid #eee",
              fontSize: "14px",
            }}
          >
            {book}
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ padding: "10px", textAlign: "center" }}>Loading...</div>
      )}
      {error && (
        <div style={{ padding: "10px", textAlign: "center", color: "red" }}>
          Error occurred
        </div>
      )}
    </div>
  );
}

export default ThrottledScrollBookSearch;
