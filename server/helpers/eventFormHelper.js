const db_connection = require("../database");

function handleEventForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { eventName, eventDate, location, eventType, price } = formData;
        const description = formData.description || null;
        const duration = formData.duration || null;
        const capacity = formData.capacity || null;
        const managerID = formData.managerID || null;

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
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
}
module.exports = handleEventForm;