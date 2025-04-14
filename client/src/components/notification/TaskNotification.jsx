import React, { useState, useEffect } from "react";
import "./TaskNotification.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const VeterinarianNotification = ({ managerId }) => {
  const [alerts, setAlerts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch veterinarian alerts on component mount and when managerId changes
  useEffect(() => {
    const managerId = localStorage.getItem("managerId");

    console.log("DEBUG FRONTEND: Component mounted or managerId changed");
    console.log("DEBUG FRONTEND: managerId value:", managerId);
    console.log("DEBUG FRONTEND: managerId type:", typeof managerId);

    if (!managerId) {
      console.log(
        "DEBUG FRONTEND: managerId is empty or undefined, returning early"
      );
      return;
    }

    const fetchAlerts = async () => {
      console.log("DEBUG FRONTEND: fetchAlerts called");
      setLoading(true);
      setError(null);

      try {
        console.log(
          `DEBUG FRONTEND: Fetching from ${API_BASE_URL}/api/veterinarian/alerts?managerId=${managerId}`
        );

        // Ensure the parameter name matches what your backend expects
        const response = await fetch(
          `${API_BASE_URL}/api/veterinarian/alerts?managerId=${managerId}`
        );

        console.log("DEBUG FRONTEND: Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("DEBUG FRONTEND: Response data:", data);

        if (data.success) {
          console.log(
            "DEBUG FRONTEND: Setting alerts, count:",
            data.data.length
          );
          setAlerts(data.data);
        } else {
          console.error(
            "DEBUG FRONTEND: API returned success=false:",
            data.message
          );
          setError(data.message || "Failed to fetch alerts");
        }
      } catch (err) {
        console.error("DEBUG FRONTEND: Error fetching alerts:", err);
        setError("Network error when fetching alerts");
        console.error("Error fetching veterinarian alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Set up polling to refresh alerts every 30 seconds
    const intervalId = setInterval(fetchAlerts, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [managerId]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const resolveAlert = async (alertId) => {
    try {
      console.log("DEBUG FRONTEND: Resolving alert ID:", alertId);

      const response = await fetch(
        `${API_BASE_URL}/api/veterinarian/resolve-alert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ alertId }),
        }
      );

      console.log("DEBUG FRONTEND: Resolve response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("DEBUG FRONTEND: Resolve response data:", data);

      if (data.success) {
        console.log(
          "DEBUG FRONTEND: Alert resolved successfully, updating state"
        );
        // Remove the alert from state
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
      } else {
        console.error("DEBUG FRONTEND: Failed to resolve alert:", data.message);
        setError(data.message || "Failed to resolve alert");
      }
    } catch (err) {
      console.error("DEBUG FRONTEND: Error in resolveAlert function:", err);
      setError("Network error when resolving alert");
      console.error("Error resolving alert:", err);
    }
  };

  const hasAlerts = alerts.length > 0;

  // Determine alert priority for styling
  const getAlertPriorityClass = (alertDesc) => {
    if (alertDesc.includes("CRITICAL")) {
      return "alert-critical";
    }
    if (alertDesc.includes("0 items left")) {
      return "alert-warning";
    }
    return "alert-normal";
  };

  return (
    <div className="task-notification-container">
      <div className="notification-icon" onClick={togglePopup}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>

        {hasAlerts && (
          <span className="notification-badge">{alerts.length}</span>
        )}
      </div>

      {isPopupOpen && (
        <div className="notification-popup">
          <div className="popup-header">
            <h3>Veterinarian Alerts</h3>
          </div>

          <div className="popup-content">
            {loading && <div className="loading">Loading alerts...</div>}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && alerts.length > 0 ? (
              <ul className="task-list">
                {alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className={`task-item ${getAlertPriorityClass(
                      alert.description
                    )}`}
                  >
                    <div className="task-details">
                      <p className="task-title">{alert.title}</p>
                      <p className="task-description">{alert.description}</p>
                      <p className="task-time">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="resolve-task-btn"
                      onClick={() => resolveAlert(alert.id)}
                      title="Mark as Resolved"
                    >
                      ✓
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !loading &&
              !error && (
                <div className="empty-tasks">
                  <p>No active alerts</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup-backdrop" onClick={togglePopup}></div>
      )}
    </div>
  );
};

export default VeterinarianNotification;
