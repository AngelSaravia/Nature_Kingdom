import React, { useState } from "react";
import "./veterinarian_criticalReport.css";

const ZooKeeperReportTable = ({ data = [], columns = [] }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [animalData, setAnimalData] = useState({});
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const toggleRow = async (enclosureId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [enclosureId]: !prev[enclosureId],
    }));

    if (!expandedRows[enclosureId] && !animalData[enclosureId]) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/animals/enclosure/${enclosureId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch animals: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setAnimalData((prev) => ({
            ...prev,
            [enclosureId]: result.data,
          }));
        } else {
          console.error("Failed to fetch animals:", result.message);
          setAnimalData((prev) => ({
            ...prev,
            [enclosureId]: [],
          }));
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
        setAnimalData((prev) => ({
          ...prev,
          [enclosureId]: [],
        }));
      }
    }
  };

  const handleAnimalAction = (animal) => {
    console.log("View details for animal:", animal);
  };

  const handleMedicalHistory = (animal) => {
    console.log("Medical history for animal:", animal);
    // Example: navigate to history page
    // window.location.href = `/animals/${animal.animal_id}/medical-history`;
  };

  const handleViewEnclosureHistory = (enclosureId) => {
    console.log("View enclosure history for:", enclosureId);
    // Implementation for viewing enclosure history
  };

  const handleViewMoreEnclosureDetails = (enclosureId) => {
    console.log("View more details for enclosure:", enclosureId);
    // Implementation for viewing more enclosure details
  };

  const calculateAge = (dob) => {
    if (!dob) return "Unknown";

    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);

    return `${years} years`;
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="no-data-message">No data available.</div>;
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    return (
      <div className="no-data-message">No columns defined for the table.</div>
    );
  }

  return (
    <div className="report-table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>Actions</th>
            {columns.map((column, index) => (
              <th key={index}>{column.replace(/_/g, " ").toUpperCase()}</th>
            ))}
            <th>Additional Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={row.enclosure_id || rowIndex}>
              <tr>
                <td>
                  <button
                    className="toggle-animals-btn"
                    onClick={() => toggleRow(row.enclosure_id)}
                  >
                    {expandedRows[row.enclosure_id]
                      ? "▼ Hide Animals"
                      : "► Show Animals"}
                  </button>
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {row[column] !== undefined && row[column] !== null
                      ? row[column].toString()
                      : ""}
                  </td>
                ))}
                <td className="additional-actions">
                  <button
                    className="enclosure-action-btn"
                    onClick={() => handleViewEnclosureHistory(row.enclosure_id)}
                  >
                    History
                  </button>
                  <button
                    className="enclosure-action-btn"
                    onClick={() =>
                      handleViewMoreEnclosureDetails(row.enclosure_id)
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    View More
                  </button>
                </td>
              </tr>
              {expandedRows[row.enclosure_id] && (
                <tr className="animal-details-row">
                  <td colSpan={columns.length + 2}>
                    <div className="animal-details-container">
                      <h4>Animals in this enclosure:</h4>
                      {animalData[row.enclosure_id] ? (
                        animalData[row.enclosure_id].length > 0 ? (
                          <table className="animal-details-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Species</th>
                                <th>Age</th>
                                <th>Health Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {animalData[row.enclosure_id].map(
                                (animal, animalIndex) => (
                                  <tr key={animal.animal_id || animalIndex}>
                                    <td>{animal.animal_name}</td>
                                    <td>{animal.species}</td>
                                    <td>
                                      {calculateAge(animal.date_of_birth)}
                                    </td>
                                    <td>{animal.health_status}</td>
                                    <td>
                                      <button
                                        className="animal-action-btn"
                                        onClick={() =>
                                          handleAnimalAction(animal)
                                        }
                                      >
                                        View Details
                                      </button>
                                      <button
                                        className="animal-action-btn"
                                        onClick={() =>
                                          handleMedicalHistory(animal)
                                        }
                                        style={{ marginLeft: "8px" }}
                                      >
                                        Medical History
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        ) : (
                          <p>No animals in this enclosure</p>
                        )
                      ) : (
                        <p>Loading animals...</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZooKeeperReportTable;
