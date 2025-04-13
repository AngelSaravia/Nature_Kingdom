 const db_connection = require("../database");

 function getEmployeeTimesheets(email, res) {
    const query = `
        SELECT
            e.email AS employee_email,
            DATE(r.clock_in) AS date,
            SEC_TO_TIME(TIMESTAMPDIFF(SECOND, r.clock_in, r.clock_out)) AS hours,  -- Convert time to hh:mm:ss
            TIMESTAMPDIFF(HOUR, r.clock_in, r.clock_out) AS hours_paid,  -- Keep hours_paid in hours
            r.record_id AS id
        FROM employees e
        LEFT JOIN employee_shift_records r ON e.employee_id = r.employee_id
        WHERE e.manager_id = (
            SELECT employee_id FROM employees WHERE email = ?
        )
        ORDER BY date DESC;
    `;
  
    db_connection.query(query, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
      } else {
        // console.log("Results:", results);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results }));
      }
    });
  }

  module.exports = { getEmployeeTimesheets };