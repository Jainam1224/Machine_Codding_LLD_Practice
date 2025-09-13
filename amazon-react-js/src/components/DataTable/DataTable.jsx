import { useState } from "react";
import users from "../../data/users";
import "./DataTable.css";

const columns = [
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Age", key: "age" },
  { label: "Occupation", key: "occupation" },
];

function paginateUsers(usersList, page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageUsers = usersList.slice(start, end);
  const totalPages = Math.ceil(usersList.length / pageSize);
  return { pageUsers, totalPages };
}

function sortUsersList(usersList, field, direction) {
  const usersClone = usersList.slice();

  switch (field) {
    case "id":
    case "age": {
      return usersClone.sort((a, b) =>
        direction === "asc" ? a[field] - b[field] : b[field] - a[field]
      );
    }
    case "name":
    case "occupation": {
      return usersClone.sort((a, b) =>
        direction === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field])
      );
    }
    default: {
      return usersClone;
    }
  }
}

export default function DataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortingDir, setSortingDir] = useState("asc");
  const [sortingField, setSortingField] = useState(null);

  const sortedUsers = sortUsersList(users, sortingField, sortingDir);

  const { totalPages, pageUsers } = paginateUsers(sortedUsers, page, pageSize);

  return (
    <div className="data-table-container">
      <h2>Data Table</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(({ label, key }) => (
                <th key={key}>
                  <button
                    className="sort-button"
                    onClick={() => {
                      if (sortingField !== key) {
                        setSortingDir("asc");
                        setSortingField(key);
                      } else {
                        sortingDir === "asc"
                          ? setSortingDir("desc")
                          : setSortingDir("asc");
                      }
                      setPage(1);
                    }}
                  >
                    {label}
                    {sortingField === key && (
                      <span className="sort-indicator">
                        {sortingDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageUsers.map(({ id, name, age, occupation }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{age}</td>
                <td>{occupation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="page-size-control">
          <label htmlFor="page-size">Show:</label>
          <select
            id="page-size"
            className="page-size-select"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        <div className="page-navigation">
          <button
            className="page-button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="page-button"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
