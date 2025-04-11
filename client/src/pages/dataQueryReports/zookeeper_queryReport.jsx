import React, { useState, useEffect } from "react";
import ZooKeeperReportTable from "./zookeeper_reportTable";
import "./zookeeperStyle.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Define column headers based on provided attributes
const columnHeaders = [
  "name",
  "current_capacity",
  "capacity",
  "status",
  "temp_control",
  "exhibit_name",
];

// Define animal column headers based on provided attributes
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
  // Better state for popup modal
  const [popupState, setPopupState] = useState({
    isOpen: false,
    animal: null,
    nextStatus: null,
  });

  useEffect(() => {
    fetchReport(); //runs once fetchReport is called
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const userManagerId = localStorage.getItem("Manager_id");

      if (!userManagerId) {
        console.error("User not logged in or missing Manager_id");
        return;
      }

      // Include the Manager_id as a query parameter
      const response = await fetch(
        `${API_BASE_URL}/query_report/enclosures_by_manager?managerId=${userManagerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success && Array.isArray(data.data)) {
        setReportData(data.data);
      } else {
        console.error("Unexpected response format:", data);
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
        return "Already Critical"; // Changed text for Critical status
      default:
        return "Update Health Status";
    }
  };

  // Modified to prevent cycling back from critical
  const getNextHealthStatusValue = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "NEEDS CARE";
      case "NEEDS CARE":
        return "CRITICAL";
      case "CRITICAL":
        return "CRITICAL"; // Stay as CRITICAL - won't cycle back
      default:
        return "HEALTHY";
    }
  };

  // Get description for status change
  const getStatusChangeDescription = (currentStatus, nextStatus) => {
    if (currentStatus === "HEALTHY" && nextStatus === "NEEDS CARE") {
      return "This animal will be marked as needing care. Regular monitoring and appropriate care will be initiated.";
    } else if (currentStatus === "NEEDS CARE" && nextStatus === "CRITICAL") {
      return "This animal will be marked as critical. Immediate veterinary attention will be required and emergency protocols will be activated.";
    } else {
      return `Health status will be updated from ${currentStatus} to ${nextStatus}.`;
    }
  };

  // Open the popup with animal information
  const initiateHealthStatusChange = (animal) => {
    // If already in CRITICAL state, don't show popup
    if (animal.health_status === "CRITICAL") {
      // Maybe show a toast or a small notification instead
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

  // Modify the button style for critical animals to be disabled
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

  const handleHealthStatusProgression = async (animal) => {
    const enclosureId = animal.enclosure_id;

    if (!enclosureId) {
      console.error("Enclosure ID is missing", animal);
      return;
    }
    setUpdateLoading(true);
    const nextStatus = getNextHealthStatusValue(animal.health_status);

    try {
      // API call to update the animal's health status
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
        // Update the local state with a safety check
        setAnimalsData((prevState) => {
          // Check if enclosureId exists in prevState
          if (!prevState || !prevState[enclosureId]) {
            console.warn(
              `Enclosure ID ${enclosureId} not found in state`,
              prevState
            );
            return prevState; // Return unchanged state
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
                                  disabled={animal.health_status === "CRITICAL"}
                                >
                                  {getButtonTextByStatus(animal.health_status)}
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
    );
  };

  // Render the new modal popup
  const renderStatusChangePopup = () => {
    if (!popupState.isOpen || !popupState.animal) return null;

    const { animal, nextStatus } = popupState;
    const currentStatus = animal.health_status;
    const isCritical = nextStatus === "CRITICAL";

    // Get the appropriate color for current and next status
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

  return (
    <div className="enclosure-query-report">
      <div className="report-table-container">
        {loading ? (
          <div className="loading-message">Loading data...</div>
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

      {/* Render the new popup */}
      {renderStatusChangePopup()}
    </div>
  );
};

export default EnclosureQueryReport;
