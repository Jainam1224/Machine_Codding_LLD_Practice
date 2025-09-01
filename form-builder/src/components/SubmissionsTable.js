import React from "react";

const SubmissionsTable = ({ submissions, schema }) => {
  const tableHeaders = schema.map((field) => ({
    key: field.name,
    label: field.label,
  }));

  const tableRows = submissions.map((submission) => ({
    id: submission.id,
    timestamp: submission.timestamp,
    data: Object.fromEntries(
      schema.map((field) => [
        field.name,
        Array.isArray(submission.data[field.name])
          ? submission.data[field.name].join(", ")
          : typeof submission.data[field.name] === "boolean"
          ? submission.data[field.name]
            ? "Yes"
            : "No"
          : submission.data[field.name] || "-",
      ])
    ),
  }));

  const renderRow = (row) => (
    <tr key={row.id} className="submission-row">
      <td className="submission-id">#{row.id}</td>
      <td className="submission-time">{row.timestamp}</td>
      {tableHeaders.map((header) => (
        <td key={header.key} className="submission-field-value">
          {row.data[header.key]}
        </td>
      ))}
    </tr>
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
};

export default SubmissionsTable;
