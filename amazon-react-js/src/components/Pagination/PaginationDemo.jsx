import { useState } from "react";
import Pagination from "./Pagination";

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `This is item number ${i + 1}`,
}));

export default function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [displayedItems, setDisplayedItems] = useState([]);

  const handlePageChange = (page, startIndex, endIndex) => {
    setCurrentPage(page);
    setDisplayedItems(sampleData.slice(startIndex, endIndex));
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div>
      <h2>Pagination</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Items per page:
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Current Items (Page {currentPage}):</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {displayedItems.map((item) => (
            <li
              key={item.id}
              style={{ padding: "5px", borderBottom: "1px solid #eee" }}
            >
              {item.name} - {item.description}
            </li>
          ))}
        </ul>
      </div>

      <Pagination
        totalItems={sampleData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        maxVisiblePages={5}
      />
    </div>
  );
}
