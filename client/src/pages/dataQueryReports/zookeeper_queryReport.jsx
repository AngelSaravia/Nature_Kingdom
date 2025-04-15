import React, { useState, useEffect } from "react";
import ZooKeeperReportTable from "./zookeeper_reportTable";
import "./zookeeperStyle.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const columnHeaders = [
  "name",
  "current_capacity",
  "capacity",
  "status",
  "temp_control",
  "exhibit_name",
];

const animalColumnHeaders = [
  "animal_name",
  "species",
  "animal_type",
  "health_status",
  "date_of_birth",
];

const EnclosureQueryReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEnclosure, setExpandedEnclosure] = useState(null);
  const [animalsData, setAnimalsData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  const [popupState, setPopupState] = useState({
    isOpen: false,
    animal: null,
    nextStatus: null,
  });

  // New state for entry feed and history feed popups
  const [feedPopupState, setFeedPopupState] = useState({
    isOpen: false,
    animal: null,
    feedType: null, // 'entry' or 'history'
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem("role");
      const managerId = localStorage.getItem("managerId");

      const queryParams = {
        table1: "enclosures",
        table2: "employees",
        join_condition: "enclosures.Manager_id = employees.employee_id",
        additional_joins: [
          {
            table: "exhibits",
            join_condition: "enclosures.exhibit_id = exhibits.exhibit_id",
          },
        ],
        computed_fields: `
            enclosures.*, 
            CONCAT(employees.first_name, ' ', employees.last_name) AS manager_name,
            exhibits.name AS exhibit_name,
            CASE enclosures.temp_control WHEN 1 THEN 'Yes' WHEN 0 THEN 'No' END AS temp_control
          `,
      };

      if (role === "zookeeper" && managerId) {
        queryParams["enclosures.Manager_id"] = managerId;

        console.log("Applying zookeeper filter:", queryParams.where_condition);
      }

      const response = await fetch(`${API_BASE_URL}/query_report/enclosures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryParams),
      });

      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
        console.log("Fetched enclosures:", data.data.length);
      } else {
        console.error("Error fetching report:", data.message);
        setReportData([]);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimalsByEnclosure = async (enclosureId) => {
    try {
      console.log(`Fetching animals for enclosure: ${enclosureId}`);
      const response = await fetch(
        `${API_BASE_URL}/animals/enclosure/${enclosureId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      console.log("Animals data received:", data);

      if (data.success) {
        setAnimalsData((prevState) => ({
          ...prevState,
          [enclosureId]: data.data,
        }));
      } else {
        console.error("Error fetching animals:", data.message);
        setAnimalsData((prevState) => ({
          ...prevState,
          [enclosureId]: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
      setAnimalsData((prevState) => ({
        ...prevState,
        [enclosureId]: [],
      }));
    }
  };

  const getButtonTextByStatus = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "Mark as Needs Care";
      case "NEEDS CARE":
        return "Mark as Critical";
      case "CRITICAL":
        return "Already Critical";
      default:
        return "Update Health Status";
    }
  };

  const getNextHealthStatusValue = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "NEEDS CARE";
      case "NEEDS CARE":
        return "CRITICAL";
      case "CRITICAL":
        return "CRITICAL";
      default:
        return "HEALTHY";
    }
  };

  const getStatusChangeDescription = (currentStatus, nextStatus) => {
    if (currentStatus === "HEALTHY" && nextStatus === "NEEDS CARE") {
      return "This animal will be marked as needing care. Regular monitoring and appropriate care will be initiated.";
    } else if (currentStatus === "NEEDS CARE" && nextStatus === "CRITICAL") {
      return "This animal will be marked as critical. Immediate veterinary attention will be required and emergency protocols will be activated.";
    } else {
      return `Health status will be updated from ${currentStatus} to ${nextStatus}.`;
    }
  };

  const initiateHealthStatusChange = (animal) => {
    if (animal.health_status === "CRITICAL") {
      return;
    }

    const nextStatus = getNextHealthStatusValue(animal.health_status);

    // For any other status change, show the popup
    setPopupState({
      isOpen: true,
      animal: animal,
      nextStatus: nextStatus,
    });
  };

  // New functions for handling Entry Feed and History Feed
  const handleEntryFeed = (animal) => {
    setFeedPopupState({
      isOpen: true,
      animal: animal,
      feedType: "entry",
    });
  };

  const handleHistoryFeed = (animal) => {
    setFeedPopupState({
      isOpen: true,
      animal: animal,
      feedType: "history",
    });
  };

  // Function to close feed popup
  const closeFeedPopup = () => {
    setFeedPopupState({
      isOpen: false,
      animal: null,
      feedType: null,
    });
  };

  // Function for confirming the health status change
  const confirmHealthStatusChange = () => {
    if (popupState.animal) {
      // Apply the health status change
      handleHealthStatusProgression(popupState.animal);
    }
    // Close the popup
    setPopupState({
      isOpen: false,
      animal: null,
      nextStatus: null,
    });
  };

  // Function for canceling the health status change
  const closePopup = () => {
    setPopupState({
      isOpen: false,
      animal: null,
      nextStatus: null,
    });
  };

  const getButtonColorByStatus = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "#5cb85c"; // Green for Healthy
      case "NEEDS CARE":
        return "#ffc107"; // Yellow/amber for Needs Care
      case "CRITICAL":
        return "#d9534f"; // Red for Critical
      default:
        return "#2c5e4e"; // Default color
    }
  };

  const getButtonStyleByStatus = (currentStatus) => {
    const baseStyle = {
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "0.9rem",
    };

    if (currentStatus === "CRITICAL") {
      return {
        ...baseStyle,
        backgroundColor: "#d9534f",
        opacity: "0.7",
        cursor: "not-allowed",
      };
    }

    return {
      ...baseStyle,
      backgroundColor: getButtonColorByStatus(currentStatus),
      cursor: "pointer",
    };
  };

  // Styles for the new buttons
  const getEntryFeedButtonStyle = () => {
    return {
      color: "white",
      backgroundColor: "#2c5e4e", // Primary zoo color
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "0.9rem",
      cursor: "pointer",
      marginLeft: "5px",
    };
  };

  const getHistoryFeedButtonStyle = () => {
    return {
      color: "white",
      backgroundColor: "#4a6d8c", // Different color for history
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "0.9rem",
      cursor: "pointer",
      marginLeft: "5px",
    };
  };

  const handleHealthStatusProgression = async (animal) => {
    const enclosureId = animal.enclosure_id;

    if (!enclosureId) {
      console.error("Enclosure ID is missing", animal);
      return;
    }
    setUpdateLoading(true);
    const nextStatus = getNextHealthStatusValue(animal.health_status);

    try {
      const response = await fetch(
        `${API_BASE_URL}/animals/${animal.animal_id}/health`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ healthStatus: nextStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAnimalsData((prevState) => {
          if (!prevState || !prevState[enclosureId]) {
            console.warn(
              `Enclosure ID ${enclosureId} not found in state`,
              prevState
            );
            return prevState;
          }

          const updatedAnimals = prevState[enclosureId].map((a) =>
            a.animal_id === animal.animal_id
              ? { ...a, health_status: nextStatus }
              : a
          );

          return {
            ...prevState,
            [enclosureId]: updatedAnimals,
          };
        });

        console.log(`Health status updated to ${nextStatus}`);
      } else {
        console.error("Failed to update health status:", data.message);
        alert("Failed to update health status: " + data.message);
      }
    } catch (error) {
      console.error("Failed to update health status:", error);
      alert("Failed to update health status. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleExpandEnclosure = (enclosureId) => {
    if (expandedEnclosure === enclosureId) {
      setExpandedEnclosure(null);
    } else {
      setExpandedEnclosure(enclosureId);
      if (!animalsData[enclosureId]) {
        fetchAnimalsByEnclosure(enclosureId);
      }
    }
  };

  const renderEnclosureRow = (enclosure, index) => {
    const isExpanded = expandedEnclosure === enclosure.enclosure_id;

    return (
      <React.Fragment key={enclosure.enclosure_id}>
        <tr onClick={() => toggleExpandEnclosure(enclosure.enclosure_id)}>
          <td>
            <button className="toggle-animals-btn">
              {isExpanded ? "▼ Hide Animals" : "► Show Animals"}
            </button>
          </td>
          {columnHeaders.map((column, idx) => (
            <td key={idx}>{enclosure[column]}</td>
          ))}
        </tr>
        {isExpanded && (
          <tr className="animals-row">
            <td colSpan={columnHeaders.length + 1}>
              <div className="animals-container">
                <h4>Animals in this enclosure:</h4>
                {animalsData[enclosure.enclosure_id] ? (
                  animalsData[enclosure.enclosure_id].length > 0 ? (
                    <table className="animals-table">
                      <thead>
                        <tr>
                          {animalColumnHeaders.map((header, idx) => (
                            <th key={idx}>
                              {header.replace(/_/g, " ").toUpperCase()}
                            </th>
                          ))}
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {animalsData[enclosure.enclosure_id].map(
                          (animal, animalIdx) => (
                            <tr key={animalIdx}>
                              {animalColumnHeaders.map((header, headerIdx) => (
                                <td key={headerIdx}>{animal[header]}</td>
                              ))}

                              <td>
                                <div
                                  className="action-buttons-container"
                                  style={{ display: "flex" }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row toggle
                                      if (animal.health_status !== "CRITICAL") {
                                        initiateHealthStatusChange(animal);
                                      }
                                    }}
                                    style={getButtonStyleByStatus(
                                      animal.health_status
                                    )}
                                    disabled={
                                      animal.health_status === "CRITICAL"
                                    }
                                  >
                                    {getButtonTextByStatus(
                                      animal.health_status
                                    )}
                                  </button>

                                  {/* New Entry Feed Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row toggle
                                      handleEntryFeed(animal);
                                    }}
                                    style={getEntryFeedButtonStyle()}
                                  >
                                    Entry Feed
                                  </button>

                                  {/* New History Feed Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row toggle
                                      handleHistoryFeed(animal);
                                    }}
                                    style={getHistoryFeedButtonStyle()}
                                  >
                                    History Feed
                                  </button>
                                </div>
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
    );
  };

  const renderStatusChangePopup = () => {
    if (!popupState.isOpen || !popupState.animal) return null;

    const { animal, nextStatus } = popupState;
    const currentStatus = animal.health_status;
    const isCritical = nextStatus === "CRITICAL";

    const getStatusColor = (status) => {
      switch (status) {
        case "HEALTHY":
          return "#d4edda"; // light green background
        case "NEEDS CARE":
          return "#fff3cd"; // light yellow background
        case "CRITICAL":
          return "#f8d7da"; // light red background
        default:
          return "#ffffff"; // white
      }
    };

    const getStatusTextColor = (status) => {
      switch (status) {
        case "HEALTHY":
          return "#155724"; // dark green text
        case "NEEDS CARE":
          return "#856404"; // dark yellow/brown text
        case "CRITICAL":
          return "#721c24"; // dark red text
        default:
          return "#212529"; // dark gray
      }
    };

    const description = getStatusChangeDescription(currentStatus, nextStatus);

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <h3>Update Health Status</h3>
            <button className="popup-close" onClick={closePopup}>
              ×
            </button>
          </div>

          <div className="popup-body">
            <div className="animal-name">
              <strong>{animal.animal_name}</strong> ({animal.species})
            </div>

            <div className="status-change">
              <div
                className="status-box"
                style={{
                  backgroundColor: getStatusColor(currentStatus),
                  color: getStatusTextColor(currentStatus),
                }}
              >
                {currentStatus}
              </div>

              <div className="arrow">
                <span>⟶</span>
              </div>

              <div
                className="status-box"
                style={{
                  backgroundColor: getStatusColor(nextStatus),
                  color: getStatusTextColor(nextStatus),
                }}
              >
                {nextStatus}
              </div>
            </div>

            <div className="status-description">{description}</div>

            {isCritical && (
              <div className="warning-message">
                <p>⚠️ Warning: Critical status cannot be changed once set.</p>
              </div>
            )}
          </div>

          <div className="popup-footer">
            <button
              className="confirm-button"
              onClick={confirmHealthStatusChange}
              style={{
                backgroundColor: "#2c5e4e",
              }}
            >
              Confirm
            </button>
            <button className="cancel-button" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // New function to render feed popup
  const renderFeedPopup = () => {
    if (!feedPopupState.isOpen || !feedPopupState.animal) return null;

    const { animal, feedType } = feedPopupState;
    const isEntryFeed = feedType === "entry";

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <h3>{isEntryFeed ? "Entry Feed" : "History Feed"}</h3>
            <button className="popup-close" onClick={closeFeedPopup}>
              ×
            </button>
          </div>

          <div className="popup-body">
            <div className="animal-name">
              <strong>{animal.animal_name}</strong> ({animal.species})
            </div>

            {isEntryFeed ? (
              <div className="feed-entry-form">
                <h4>Record New Feed Entry</h4>
                <div className="form-group">
                  <label htmlFor="feedType">Feed Type:</label>
                  <select id="feedType" className="form-control">
                    <option value="">Select Feed Type</option>
                    <option value="regular">Regular Feed</option>
                    <option value="special">Special Diet Feed</option>
                    <option value="medication">Medication</option>
                    <option value="supplements">Supplements</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="feedQuantity">Quantity (kg):</label>
                  <input
                    type="number"
                    id="feedQuantity"
                    className="form-control"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="feedNotes">Notes:</label>
                  <textarea
                    id="feedNotes"
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="feed-history">
                <h4>Feed History</h4>
                <div className="feed-history-placeholder">
                  <p>Feed history will be displayed here.</p>
                  <p>
                    You can implement the actual feed history fetching logic
                    from your API.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="popup-footer">
            {isEntryFeed ? (
              <>
                <button
                  className="confirm-button"
                  onClick={() => {
                    // Add logic to save feed entry
                    closeFeedPopup();
                  }}
                  style={{
                    backgroundColor: "#2c5e4e",
                  }}
                >
                  Save Entry
                </button>
                <button className="cancel-button" onClick={closeFeedPopup}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="close-button" onClick={closeFeedPopup}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="enclosure-query-report">
      <div className="report-title">
        <h2>Enclosure Report</h2>
      </div>
      <div className="report-table-container">
        {loading ? (
          <div className="loading-message">Loading data...</div>
        ) : reportData.length === 0 ? (
          <div className="no-data-message">
            No enclosures found for your account.
          </div>
        ) : (
          <table className="enclosure-table">
            <thead>
              <tr>
                <th>ACTIONS</th>
                {columnHeaders.map((header, idx) => (
                  <th key={idx}>{header.replace(/_/g, " ").toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((enclosure, idx) =>
                renderEnclosureRow(enclosure, idx)
              )}
            </tbody>
          </table>
        )}
      </div>

      {renderStatusChangePopup()}
      {renderFeedPopup()}
    </div>
  );
};

export default EnclosureQueryReport;
