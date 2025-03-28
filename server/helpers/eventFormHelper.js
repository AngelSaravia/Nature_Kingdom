const db_connection = require("../database");

function handleEventForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { action, eventID, eventName, eventDate, location, eventType, price } = formData;
        const description = formData.description || null;
        const duration = formData.duration || null;
        const capacity = formData.capacity || null;
        const managerID = formData.managerID || null;

        if (action === "add") {
          if (!eventName || !eventDate || !location || !eventType || !price) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
            return;
          }
          const sql = "INSERT INTO events (eventName, eventDate, location, eventType, price, description, duration, capacity, managerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const values = [eventName, eventDate, location, eventType, price, description, duration, capacity, managerID];
          db_connection.query(sql, values, (err, result) => {
            if (err) {
              console.error("Database insert error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
            }
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Event added successfully", id: result.insertId }));
          });

        } else if (action === "update") {
          if (!eventName || !eventDate || !location || !eventType || !price) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
            return;
          }
          const sql = "UPDATE events SET eventName = ?, eventDate = ?, location = ?, eventType = ?, price = ?, description = ?, duration = ?, capacity = ?, managerID = ? WHERE eventID = ?";
          const values = [eventName, eventDate, location, eventType, price, description, duration, capacity, managerID, eventID];
          db_connection.query(sql, values, (err, result) => {
            if (err) {
              console.error("Database update error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
            }
  
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Event updated successfully" }));
          });

        } else if (action === "delete"){
          if (!eventID){
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Event ID is required for deletion" }));
            return;
          }
          const sql = "DELETE FROM events WHERE eventID = ?";
          db_connection.query(sql, [eventID], (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Database error" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Event deleted successfully" }));
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
module.exports = handleEventForm;