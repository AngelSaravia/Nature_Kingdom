const db_connection = require("../database");

function handleEnclosureForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { name, current_capacity, capacity, exhibit_id, temp_control } = formData;
        const Manager_id = formData.Manager_id || null;
        const location = formData.location || null;
        const opens_at = formData.opens_at || null;
        const closes_at = formData.closes_at || null;
        const status = formData.status || null;


        if (!name || !current_capacity || !capacity || !exhibit_id || !temp_control) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
          return;
        }
        const tempControlValue = temp_control ? 1 : 0;
        const sql = "INSERT INTO enclosures (name, current_capacity, capacity, exhibit_id, temp_control, Manager_id, location, opens_at, closes_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [name, current_capacity, capacity, exhibit_id, tempControlValue, Manager_id, location, opens_at, closes_at, status];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Enclosure added successfully", id: result.insertId }));
        });
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
  }
module.exports = handleEnclosureForm;