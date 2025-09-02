import { useState } from "react";
import useBookSearch from "./useBookSearch";
import styles from "./BookSearch.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Button Trigger Method</h3>
        <p className={styles.description}>
          Search books with manual load more button
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? "Loading..." : "Load More Books"}
          </button>
        </div>
      )}

      {error && <div className={styles.errorMessage}>Error occurred</div>}
    </div>
  );
}

export default ButtonTriggerBookSearch;
