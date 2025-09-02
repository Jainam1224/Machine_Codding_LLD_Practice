import { useState, useEffect, useCallback, useRef } from "react";
import useBookSearch from "./useBookSearch";
import styles from "./BookSearch.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Throttled Scroll Method</h3>
        <p className={styles.description}>
          Scroll down to load more books (throttled for performance)
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

export default ThrottledScrollBookSearch;
