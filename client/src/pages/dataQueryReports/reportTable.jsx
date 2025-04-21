import React from "react";
import "./reportStyles.css";

const ReportTable = ({ data, columns, renderActions, columnLabels }) => {
  return (
    <div className="report-table">
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{columnLabels[col] || col}</th> // Use columnLabels if available
              ))}
              {renderActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>
                    {/* Format specific date-related columns */}
                    {[
                      "date",
                      "start_date",
                      "end_date",
                      "purchase_date",
                      "eventDate",
                      "date_of_birth",
                      "followup",
                      "order_date",
                    ].includes(col) && row[col]
                      ? new Date(row[col]).toISOString().split("T")[0] // Format to YYYY-MM-DD
                      : row[col]}
                  </td>
                ))}
                {renderActions && <td>{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ReportTable;
