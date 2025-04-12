const db_connection = require("../database");

function getClockInStatus(email, res) {
  const query = `
    SELECT es.clock_in, es.clock_out, e.user_name
    FROM employee_shift_records AS es
    JOIN employees AS e ON e.employee_id = es.employee_id
    WHERE e.email = ?
    ORDER BY es.clock_in DESC
    LIMIT 1
  `;
    // console.log("Query:", query);
  db_connection.query(query, [email], (err, results) => {
    // console.log("Results:", results);
    if (err) {
      console.error("Database error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Database error" }));
    } else if (results.length === 0) {
      console.log("No clock-in data found");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "No clock-in data found" }));
    } else {
      const record = results[0];
      // console.log("Clock-in record:", record);

      const clockedIn = record.clock_out === null;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        data: {
          ...record,
          clocked_in: clockedIn
        }
      }));
    }
  });
}

function setClockOutStatus(email, clockedIn, res) {
  const query = `
    UPDATE employee_shift_records
    SET clock_out = NOW()
    WHERE employee_id = (
      SELECT employee_id
      FROM employees
      WHERE email = ?
    )
    ORDER BY clock_in DESC
    LIMIT 1

  `;

  db_connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Database error" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Clock-in status updated successfully" }));
    }
  });
}

function setClockInStatus(email, clockedIn, res) {
  const query = `
    INSERT INTO employee_shift_records (employee_id, clock_in, clock_out)
    VALUES (
    (SELECT employee_id FROM employees WHERE email = ?),
    NOW(),
    NULL
    );

  `;
  // console.log("email:", email);

  db_connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Database error" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Clock-in status updated successfully" }));
    }
  });
}

module.exports = { getClockInStatus,setClockInStatus,setClockOutStatus };
