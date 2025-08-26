import { useEffect, useState } from "react";

export default function useBookSearchFetch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const abortController = new AbortController();

    if (query) {
      const url = new URL("http://openlibrary.org/search.json");
      url.searchParams.append("q", query);
      url.searchParams.append("page", pageNumber);

      fetch(url, {
        signal: abortController.signal,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setBooks((prevBooks) => {
            return [
              ...new Set([...prevBooks, ...data.docs.map((b) => b.title)]),
            ];
          });
          setHasMore(data.docs.length > 0);
          setLoading(false);
        })
        .catch((e) => {
          if (e.name === "AbortError") return;
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => abortController.abort();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}
