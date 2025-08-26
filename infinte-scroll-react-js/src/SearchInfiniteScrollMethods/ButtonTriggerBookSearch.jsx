import { useState } from "react";
import useBookSearch from "./useBookSearch";

function ButtonTriggerBookSearch() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
          Button Trigger Method
        </h3>
        <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
          Search books with manual load more button
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

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            style={{
              padding: "6px 12px",
              fontSize: "14px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Load More Books"}
          </button>
        </div>
      )}

      {error && (
        <div style={{ padding: "10px", textAlign: "center", color: "red" }}>
          Error occurred
        </div>
      )}
    </div>
  );
}

export default ButtonTriggerBookSearch;
