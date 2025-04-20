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

  // State for feed entry form
  const [entryFormData, setEntryFormData] = useState({
    schedule_id: "",
    animal_id: "",
    enclosure_id: "",
    employee_id: "",
    date: "",
    health_status: "",
    summary: "",
  });

  // State for feed history
  const [feedHistory, setFeedHistory] = useState([]);
  const [feedSubmissionStatus, setFeedSubmissionStatus] = useState(null);

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
        queryParams["Manager_id"] = managerId;

        console.log("Applying zookeeper filter:", queryParams.where_condition);
      }

      const response = await fetch(`${API_BASE_URL}/entryForm/enclosures`, {
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

    // Pre-populate form data for the selected animal
    setEntryFormData({
      schedule_id: "",
      animal_id: animal.animal_id || "",
      enclosure_id: animal.enclosure_id || "",
      employee_id: localStorage.getItem("employeeId") || "",
      date: formatDateTime(new Date()),
      health_status: animal.health_status || "HEALTHY",
      summary: "",
    });
  };

  const handleHistoryFeed = (animal) => {
    setFeedPopupState({
      isOpen: true,
      animal: animal,
      feedType: "history",
    });

    // Load feed history for this animal
    fetchFeedHistory(animal.animal_id);
  };

  // Function to close feed popup
  const closeFeedPopup = () => {
    setFeedPopupState({
      isOpen: false,
      animal: null,
      feedType: null,
    });
    setEntryFormData({
      schedule_id: "",
      animal_id: "",
      enclosure_id: "",
      employee_id: "",
      date: "",
      health_status: "",
      summary: "",
    });
    setFeedHistory([]);
  };

  // Function to format date and time for the form
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return new Date(dateTime).toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:mm'
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
                                <td key={headerIdx}>
                                  {header === "date_of_birth"
                                    ? formatDateYMD(animal[header])
                                    : animal[header]}
                                </td>
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

  const fetchFeedHistory = async (animalId) => {
    try {
      console.log(`Fetching feed history for animal ID: ${animalId}`);

      // For GET requests with query parameters, make sure we're using proper URL formatting
      const url = new URL(`${API_BASE_URL}/get_feedLogs`);
      url.searchParams.append("animal_id", animalId);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Feed history response:", data);

      if (data.success) {
        // Make sure we're filtering for the specific animal if the backend doesn't do it
        const filteredData = data.data.filter(
          (item) =>
            item.animal_id === parseInt(animalId) || item.animal_id === animalId
        );
        console.log(
          `Found ${filteredData.length} feed entries for animal ID ${animalId}`
        );
        setFeedHistory(filteredData);
      } else {
        console.error("Error fetching feed history:", data.message);
        setFeedHistory([]);
      }
    } catch (error) {
      console.error("Error fetching feed history:", error);
      setFeedHistory([]);
    }
  };

  // Handle text input changes for feed form
  const handleFeedFormChange = (event) => {
    const { name, value } = event.target;
    setEntryFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle dropdown selections for feed form
  const handleFeedFormSelect = (name, value) => {
    setEntryFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle numeric input for feed form
  const handleFeedNumericInput = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "");
  };

  // Handle feed form submission
  const handleFeedFormSubmit = async () => {
    const requiredFields = [
      "animal_id",
      "enclosure_id",
      "employee_id",
      "health_status",
      "summary",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = entryFormData[field];
      if (typeof value === "string") {
        return !value.trim();
      } else {
        return value === null || value === undefined || value === "";
      }
    });

    if (missingFields.length > 0) {
      setFeedSubmissionStatus({
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    const requestData = {
      ...entryFormData,
      date: formatDateTime(entryFormData.date),
      action: "add",
    };

    delete requestData.schedule_id; // Remove schedule_id for add action

    try {
      const response = await fetch(`${API_BASE_URL}/feedLog_form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      setFeedSubmissionStatus(result);

      if (result.success) {
        // Update the animal's health status if it changed
        if (
          entryFormData.health_status !== feedPopupState.animal.health_status
        ) {
          await updateAnimalHealthStatus(
            entryFormData.animal_id,
            entryFormData.health_status
          );
        }

        // Clear the form after successful submission
        setTimeout(() => {
          closeFeedPopup();
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting feed form:", error);
      setFeedSubmissionStatus({
        success: false,
        message: "Server error. Please try again.",
      });
    }
  };

  // Function to update animal health status after feed submission
  const updateAnimalHealthStatus = async (animalId, newStatus) => {
    try {
      // Update local state first
      const enclosureId = feedPopupState.animal.enclosure_id;

      setAnimalsData((prevState) => {
        if (!prevState || !prevState[enclosureId]) {
          return prevState;
        }

        const updatedAnimals = prevState[enclosureId].map((a) =>
          a.animal_id === animalId ? { ...a, health_status: newStatus } : a
        );

        return {
          ...prevState,
          [enclosureId]: updatedAnimals,
        };
      });

      // Also update on server
      await fetch(`${API_BASE_URL}/animals/${animalId}/health`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ healthStatus: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update health status:", error);
    }
  };

  const formatDateYMD = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // New function to render feed popup
  const renderFeedPopup = () => {
    if (!feedPopupState.isOpen || !feedPopupState.animal) return null;

    const { animal, feedType } = feedPopupState;
    const isEntryFeed = feedType === "entry";

    const formStyles = {
      formRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "15px",
        gap: "15px",
      },
      label: {
        fontWeight: "600",
        marginBottom: "5px",
        display: "block",
      },
      input: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      },
      select: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      },
      textarea: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        resize: "vertical",
      },
    };

    return (
      <div className="popup-overlay">
        <div
          className="popup-content"
          style={{ maxWidth: "800px", width: "90%" }}
        >
          <div className="popup-header">
            <h3>{isEntryFeed ? "Entry Feed" : "History Feed"}</h3>
            <button className="popup-close" onClick={closeFeedPopup}>
              ×
            </button>
          </div>

          <div className="popup-body">
            <div className="animal-name" style={{ marginBottom: "15px" }}>
              <strong>{animal.animal_name}</strong> ({animal.species})
            </div>

            {isEntryFeed ? (
              <div className="feed-entry-form">
                <h4>Record New Feed Entry</h4>

                <div style={formStyles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>ANIMAL ID *</label>
                    <input
                      type="text"
                      name="animal_id"
                      value={entryFormData.animal_id}
                      onChange={handleFeedFormChange}
                      pattern="[0-9]+"
                      onInput={handleFeedNumericInput}
                      style={formStyles.input}
                      readOnly
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>ENCLOSURE ID *</label>
                    <input
                      type="text"
                      name="enclosure_id"
                      value={entryFormData.enclosure_id}
                      onChange={handleFeedFormChange}
                      pattern="[0-9]+"
                      onInput={handleFeedNumericInput}
                      style={formStyles.input}
                      readOnly
                    />
                  </div>
                </div>

                <div style={formStyles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>EMPLOYEE ID *</label>
                    <input
                      type="text"
                      name="employee_id"
                      value={entryFormData.employee_id}
                      onChange={handleFeedFormChange}
                      pattern="[0-9]+"
                      onInput={handleFeedNumericInput}
                      style={formStyles.input}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>
                      FEEDING SCHEDULE DATE *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={entryFormData.date}
                      onChange={handleFeedFormChange}
                      style={formStyles.input}
                    />
                  </div>
                </div>

                <div style={formStyles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>HEALTH STATUS *</label>
                    <select
                      name="health_status"
                      value={entryFormData.health_status}
                      onChange={(e) => handleFeedFormChange(e)}
                      style={formStyles.select}
                    >
                      <option value="">Select health status</option>
                      <option value="HEALTHY">HEALTHY</option>
                      <option value="NEEDS CARE">NEEDS CARE</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                </div>

                <div style={formStyles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={formStyles.label}>SUMMARY *</label>
                    <textarea
                      name="summary"
                      value={entryFormData.summary}
                      onChange={handleFeedFormChange}
                      rows="5"
                      placeholder="Enter feed log summary"
                      style={formStyles.textarea}
                    ></textarea>
                  </div>
                </div>

                {feedSubmissionStatus && (
                  <div
                    style={{
                      padding: "10px",
                      marginTop: "10px",
                      backgroundColor: feedSubmissionStatus.success
                        ? "#d4edda"
                        : "#f8d7da",
                      color: feedSubmissionStatus.success
                        ? "#155724"
                        : "#721c24",
                      borderRadius: "4px",
                    }}
                  >
                    {feedSubmissionStatus.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="feed-history">
                <h4>Feed History</h4>
                {feedHistory.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          Health Status
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          Employee ID
                        </th>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedHistory.map((entry, index) => (
                        <tr key={index}>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {new Date(entry.date).toLocaleString()}
                          </td>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {entry.health_status}
                          </td>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {entry.employee_id}
                          </td>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            {entry.summary}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No feed history available for this animal.</p>
                )}
              </div>
            )}
          </div>

          <div className="popup-footer">
            {isEntryFeed ? (
              <>
                <button
                  className="confirm-button"
                  onClick={handleFeedFormSubmit}
                  style={{
                    backgroundColor: "#2c5e4e",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Save Entry
                </button>
                <button
                  className="cancel-button"
                  onClick={closeFeedPopup}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="close-button"
                onClick={closeFeedPopup}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
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
