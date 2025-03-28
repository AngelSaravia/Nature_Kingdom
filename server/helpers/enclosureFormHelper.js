const db_connection = require("../database");

function handleEnclosureForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { action, enclosure_id, name, current_capacity, capacity, exhibit_id, temp_control } = formData;
        const Manager_id = formData.Manager_id || null;
        const location = formData.location || null;
        const opens_at = formData.opens_at || null;
        const closes_at = formData.closes_at || null;
        const status = formData.status || null;

        if (action !== "delete" && (temp_control !== 1 && temp_control !== 0)) {
          return res.status(400).json({ success: false, message: "Invalid temperature control value" });
        }

        if (action === "add"){
          if (!name || !current_capacity || !capacity || !exhibit_id || !temp_control === undefined) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
            return;
          }
          if (status && !['active', 'inactive', 'under_maintenance'].includes(status)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: false, 
                message: "Invalid status value" 
            }));
            return;
          }
          const tempControlValue = (typeof temp_control === "boolean") ? (temp_control ? 1 : 0) : 0;
          const sql = "INSERT INTO enclosures (name, current_capacity, capacity, exhibit_id, temp_control, Manager_id, location, opens_at, closes_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const values = [name, current_capacity, capacity, exhibit_id, tempControlValue, Manager_id, location, opens_at, closes_at, status];

          db_connection.query(sql, values, (err, result) => {
            if (err) {
              console.error("Database insert error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
            }
  
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Enclosure added successfully", id: result.insertId }));
          });

        } else if (action === "update") {
          if (!name || !current_capacity || !capacity || !exhibit_id || !temp_control === undefined) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
            return;
          }
          if (status && !['active', 'inactive', 'under_maintenance'].includes(status)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: false, 
                message: "Invalid status value" 
            }));
            return;
          }
          const tempControlValue = (typeof temp_control === "boolean") ? (temp_control ? 1 : 0) : 0;
          const sql = "UPDATE enclosures SET name = ?, current_capacity = ?, capacity = ?, exhibit_id = ?, temp_control = ?, Manager_id = ?, location = ?, opens_at = ?, closes_at = ?, status = ? WHERE enclosure_id = ?";
          const values = [name, current_capacity, capacity, exhibit_id, tempControlValue, Manager_id, location, opens_at, closes_at, status, enclosure_id];

          db_connection.query(sql, values, (err, result) => {
            if (err) {
              console.error("Database update error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
            }
  
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Enclosure updated successfully" }));
          });

        } else if (action === "delete") {
          if (!enclosure_id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Enclosure ID is required for deletion" }));
            return;
          }

          const sql = "DELETE FROM enclosures WHERE enclosure_id = ?";
          db_connection.query(sql, [enclosure_id], (err, result) => {
          if (err) {
              console.error("Database delete error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Enclosure deleted successfully" }));
          });

        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "Invalid action" }));
        }
        
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
  }
module.exports = handleEnclosureForm;