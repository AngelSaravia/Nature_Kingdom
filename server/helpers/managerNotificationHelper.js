const db_connection = require("../database");

/**
 * Get all active alerts for a specific manager
 * @param {number} employeeId - The employee ID of the manager
 * @returns {Promise} - Promise resolving to the alerts data
 */
const getManagerAlerts = (employeeId) => {
  return new Promise((resolve, reject) => {
    const verifyManagerQuery = `
      SELECT Employee_id FROM employees  
      WHERE Employee_id = ? AND role = 'manager'
    `; //verify if employee is manager

    db_connection.query(
      verifyManagerQuery,
      [employeeId],
      (err, managerResults) => {
        if (err) {
          console.error("Error verifying manager status:", err);
          reject(err);
          return;
        }

        if (managerResults.length === 0) {
          console.warn(
            `Employee ID ${employeeId} is not a manager or doesn't exist`
          );
          resolve([]); // Return empty array rather than error for security
          return;
        }

        // Get alerts where the receiver_id matches the manager's employee ID
        const alertsQuery = `
        SELECT * FROM alerts 
        WHERE status = 'active' 
        AND receiver_id = ? 
        ORDER BY created_at DESC
      `;

        db_connection.query(alertsQuery, [employeeId], (err, results) => {
          if (err) {
            console.error("Error fetching manager alerts:", err);
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
      }
    );
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
  getManagerAlerts,
  resolveAlert,
};
