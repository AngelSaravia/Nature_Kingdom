import React from "react";
import "./reportStyles.css";

const ReportTable = ({ data, columns }) => {
  return (
    <div className="report-table">
      <h3>Report</h3>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
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
