import { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import styles from "./BookSearch.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Axios + Intersection Observer</h3>
        <p className={styles.description}>
          Search books using Axios with automatic infinite scroll
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
        {books.map((book, index) => {
          if (books.length - 10 === index + 1) {
            return (
              <div
                ref={lastBookElementRef}
                key={book}
                className={styles.bookItem}
              >
                {book}
              </div>
            );
          } else {
            return (
              <div key={book} className={styles.bookItem}>
                {book}
              </div>
            );
          }
        })}
      </div>

      {loading && <div className={styles.loadingMessage}>Loading...</div>}
      {error && <div className={styles.errorMessage}>Error occurred</div>}
    </div>
  );
}

export default AxiosWithIntersectionObserver;
