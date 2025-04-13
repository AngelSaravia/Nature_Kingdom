import React, { useState, useEffect } from "react";
import "./veterinarian_criticalReport.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const animalColumnHeaders = [
  "animal_name",
  "species",
  "animal_type",
  "health_status",
  "date_of_birth",
  "enclosure_name", // Added to show which enclosure the animal belongs to
];

const CriticalAnimalsReport = () => {
  const [criticalAnimals, setCriticalAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [popupState, setPopupState] = useState({
    isOpen: false,
    animal: null,
    nextStatus: null,
  });

  useEffect(() => {
    fetchCriticalAnimals();
  }, []);

  const fetchCriticalAnimals = async () => {
    setLoading(true);
    try {
      // Fetch all enclosures first
      const enclosureResponse = await fetch(
        `${API_BASE_URL}/query_report/enclosures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            exhibits.name AS exhibit_name
          `,
          }),
        }
      );

      const enclosureData = await enclosureResponse.json();

      if (!enclosureData.success) {
        console.error("Error fetching enclosures:", enclosureData.message);
        setLoading(false);
        return;
      }

      // Create a map of enclosure IDs to names for quick lookup
      const enclosureMap = {};
      enclosureData.data.forEach((enclosure) => {
        enclosureMap[enclosure.enclosure_id] = enclosure.name;
      });

      // Fetch all animals with critical or needs care status
      const allCriticalAnimals = [];

      // Fetch animals for each enclosure and filter them
      for (const enclosure of enclosureData.data) {
        const animalsResponse = await fetch(
          `${API_BASE_URL}/animals/enclosure/${enclosure.enclosure_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const animalsData = await animalsResponse.json();

        if (animalsData.success) {
          // Filter animals by health status
          const criticalInEnclosure = animalsData.data.filter(
            (animal) =>
              animal.health_status === "CRITICAL" ||
              animal.health_status === "NEEDS CARE"
          );

          // Add enclosure name to each animal
          criticalInEnclosure.forEach((animal) => {
            animal.enclosure_name = enclosure.name;
          });

          allCriticalAnimals.push(...criticalInEnclosure);
        }
      }

      setCriticalAnimals(allCriticalAnimals);
    } catch (error) {
      console.error("Error fetching critical animals:", error);
    } finally {
      setLoading(false);
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

  const handleHealthStatusProgression = async (animal) => {
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
        // Update the status in our local state
        setCriticalAnimals((prevAnimals) =>
          prevAnimals.map((a) =>
            a.animal_id === animal.animal_id
              ? { ...a, health_status: nextStatus }
              : a
          )
        );

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

  return (
    <div className="critical-animals-report">
      <div className="report-table-container">
        {loading ? (
          <div className="loading-message">Loading data...</div>
        ) : criticalAnimals.length === 0 ? (
          <div className="no-data-message">
            No animals currently need attention.
          </div>
        ) : (
          <table className="animals-table">
            <thead>
              <tr>
                {animalColumnHeaders.map((header, idx) => (
                  <th key={idx}>{header.replace(/_/g, " ").toUpperCase()}</th>
                ))}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {criticalAnimals.map((animal, idx) => (
                <tr key={animal.animal_id || idx}>
                  {animalColumnHeaders.map((header, headerIdx) => (
                    <td key={headerIdx}>{animal[header]}</td>
                  ))}
                  <td>
                    <button
                      onClick={() => {
                        if (animal.health_status !== "CRITICAL") {
                          initiateHealthStatusChange(animal);
                        }
                      }}
                      style={getButtonStyleByStatus(animal.health_status)}
                      disabled={animal.health_status === "CRITICAL"}
                    >
                      {getButtonTextByStatus(animal.health_status)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {renderStatusChangePopup()}
    </div>
  );
};

export default CriticalAnimalsReport;
