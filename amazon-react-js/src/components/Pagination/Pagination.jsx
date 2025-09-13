import { useState, useEffect } from "react";
import "./Pagination.css";

export default function Pagination({
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (onPageChange) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      onPageChange(currentPage, startIndex, endIndex);
    }
  }, [currentPage, itemsPerPage, totalItems, onPageChange]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {showPageNumbers && (
          <div className="page-numbers">
            {getVisiblePages().map((page) => (
              <button
                key={page}
                className={`page-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        <button
          className="pagination-btn"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
