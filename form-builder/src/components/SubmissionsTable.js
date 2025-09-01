import React, { useMemo, useCallback } from "react";
import { FormDataFormatter } from "../utils/formDataFormatter";

// Memoized table component for better performance
const SubmissionsTable = React.memo(({ submissions, schema }) => {
  // Memoize table headers and rows to prevent unnecessary re-renders
  const tableHeaders = useMemo(
    () => FormDataFormatter.createTableHeaders(schema),
    [schema]
  );

  const tableRows = useMemo(
    () => FormDataFormatter.createTableRows(submissions, schema),
    [submissions, schema]
  );

  // Memoize row rendering to prevent unnecessary re-renders
  const renderRow = useCallback(
    (row) => (
      <tr key={row.id} className="submission-row">
        <td className="submission-id">#{row.id}</td>
        <td className="submission-time">{row.timestamp}</td>
        {tableHeaders.map((header) => (
          <td key={header.key} className="submission-field-value">
            {row.data[header.key]}
          </td>
        ))}
      </tr>
    ),
    [tableHeaders]
  );

  if (submissions.length === 0) {
    return (
      <div className="no-submissions">
        <p>No form submissions yet. Submit the form to see data here!</p>
      </div>
    );
  }

  return (
    <div className="submissions-table-container">
      <table className="submissions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Time</th>
            {tableHeaders.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>{tableRows.map(renderRow)}</tbody>
      </table>
    </div>
  );
});

export default SubmissionsTable;
