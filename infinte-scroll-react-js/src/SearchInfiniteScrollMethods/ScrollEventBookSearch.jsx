import { useState, useEffect, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import styles from "./BookSearch.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Scroll Event Method</h3>
        <p className={styles.description}>
          Search books with scroll event detection
        </p>
        <input
          type="text"
          value={query ?? ""}
          onChange={handleSearch}
          placeholder="Search for books..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.bookList}>
        {books.map((book, index) => (
          <div key={`${book}-${index}`} className={styles.bookItem}>
            {book}
          </div>
        ))}
      </div>

      {loading && <div className={styles.loadingMessage}>Loading...</div>}
      {error && <div className={styles.errorMessage}>Error occurred</div>}
    </div>
  );
}

export default ScrollEventBookSearch;
