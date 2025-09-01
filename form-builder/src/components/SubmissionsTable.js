import React, { useMemo, useCallback } from "react";

// Memoized table component for better performance
const SubmissionsTable = React.memo(({ submissions, schema }) => {
  // Memoize table headers and rows to prevent unnecessary re-renders
  const tableHeaders = useMemo(
    () =>
      schema.map((field) => ({
        key: field.name,
        label: field.label,
      })),
    [schema]
  );

  const tableRows = useMemo(
    () =>
      submissions.map((submission) => ({
        id: submission.id,
        timestamp: submission.timestamp,
        data: Object.fromEntries(
          schema.map((field) => [
            field.name,
            // Simple formatting - handle arrays, booleans, and empty values
            Array.isArray(submission.data[field.name])
              ? submission.data[field.name].join(", ")
              : typeof submission.data[field.name] === "boolean"
              ? submission.data[field.name]
                ? "Yes"
                : "No"
              : submission.data[field.name] || "-",
          ])
        ),
      })),
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
