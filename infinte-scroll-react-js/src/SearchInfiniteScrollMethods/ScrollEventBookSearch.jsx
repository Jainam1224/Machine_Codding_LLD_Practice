import { useState, useEffect, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function ScrollEventBookSearch() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

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

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
          Scroll Event Method
        </h3>
        <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
          Search books with scroll event detection
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

export default ScrollEventBookSearch;
