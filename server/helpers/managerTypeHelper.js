const db_connection = require("../database");

function getManagerType(employeeId, res) {
  const query = `
      SELECT type_of_manager
      FROM managers_type
      WHERE manager_id = ?
    `;
  console.log("Query:", query);
  db_connection.query(query, [employeeId], (err, results) => {
    console.log("Results:", results);
    if (err) {
      console.error("Database error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Database error" }));
    } else if (results.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "No Manager Type found" })
      );
    } else {
      const record = results[0];

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          data: {
            ...record,
          },
        })
      );
    }
  });
}

module.exports = { getManagerType };
