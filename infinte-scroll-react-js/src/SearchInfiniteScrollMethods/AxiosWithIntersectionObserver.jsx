import { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function AxiosWithIntersectionObserver() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
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

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
          Axios + Intersection Observer
        </h3>
        <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
          Search books using Axios with automatic infinite scroll
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
        {books.map((book, index) => {
          if (books.length - 10 === index + 1) {
            return (
              <div
                ref={lastBookElementRef}
                key={book}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                }}
              >
                {book}
              </div>
            );
          } else {
            return (
              <div
                key={book}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                }}
              >
                {book}
              </div>
            );
          }
        })}
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

export default AxiosWithIntersectionObserver;
