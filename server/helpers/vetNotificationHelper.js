// helpers/vetNotificationHelper.js
const db_connection = require("../database");

/**
 * Get all active alerts for a specific veterinarian/manager
 * @param {number} managerId - The ID of the veterinarian/manager
 * @returns {Promise} - Promise resolving to the alerts data
 */
const getVeterinarianAlerts = (managerId) => {
  return new Promise((resolve, reject) => {
    // Option 1: If alerts are directly linked to the manager ID
    const query = `
      SELECT * FROM alerts 
      WHERE status = 'active' 
      AND receiver_id = ? 
      ORDER BY created_at DESC
    `;

    // Option 2: If you need alerts for all employees under a manager
    // Uncomment this query and comment out the one above if this is your requirement
    /*
    const query = `
      SELECT a.* FROM alerts a
      JOIN employees e ON a.receiver_id = e.Employee_id
      WHERE a.status = 'active' 
      AND e.Manager_id = ?
      ORDER BY a.created_at DESC
    `;
    */

    db_connection.query(query, [managerId], (err, results) => {
      if (err) {
        console.error("Error fetching veterinarian alerts:", err);
        reject(err);
        return;
      }

      // Transform the alerts data to be more frontend-friendly
      const formattedAlerts = results.map((alert) => ({
        id: alert.alert_id,
        title: getAlertTitle(alert.alert_message),
        description: alert.alert_message,
        createdAt: alert.created_at,
        status: alert.status,
      }));

      resolve(formattedAlerts);
    });
  });
};

/**
 * Extract a concise title from the alert message
 * @param {string} message - The full alert message
 * @returns {string} - A short title
 */
function getAlertTitle(message) {
  if (message.includes("requires attention")) {
    // Extract animal name for attention alerts
    const matches = message.match(/Animal "([^"]+)"/);
    if (matches && matches[1]) {
      return `${matches[1]} needs attention`;
    }
  } else if (message.includes("is low")) {
    // Extract product name for stock alerts
    const matches = message.match(/Stock for product "([^"]+)"/);
    if (matches && matches[1]) {
      return `Low stock: ${matches[1]}`;
    }
  }

  // Default fallback if pattern doesn't match
  return message.substring(0, 30) + (message.length > 30 ? "..." : "");
}

/**
 * Resolve an alert (mark as resolved)
 * @param {number} alertId - The ID of the alert to resolve
 * @returns {Promise} - Promise resolving to the result
 */
const resolveAlert = (alertId) => {
  return new Promise((resolve, reject) => {
    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = `
      UPDATE alerts 
      SET status = 'resolved', resolved_at = ? 
      WHERE alert_id = ?
    `;

    db_connection.query(query, [currentTime, alertId], (err, results) => {
      if (err) {
        console.error("Error resolving alert:", err);
        reject(err);
        return;
      }

      if (results.affectedRows === 0) {
        reject(new Error("Alert not found or already resolved"));
        return;
      }

      resolve({ success: true });
    });
  });
};

module.exports = {
  getVeterinarianAlerts,
  resolveAlert,
};
