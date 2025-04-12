const db_connection = require("../database");

function handleFeedForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const formData = JSON.parse(body);
            const { action, schedule_id, animal_id, enclosure_id, employee_id, health_status, summary } = formData;
            const date = formData.date || null;
            if (action === "add") {
                if (!animal_id || !enclosure_id || !employee_id || !health_status || !summary) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }
                const sql = "INSERT INTO feed_schedules (animal_id, enclosure_id, employee_id, date, health_status, summary) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [animal_id, enclosure_id, employee_id, date, health_status, summary];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Feed log added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                if (!animal_id || !enclosure_id || !employee_id || !health_status || !summary) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }
                const sql = "UPDATE feed_schedules SET animal_id = ?, enclosure_id = ?, employee_id = ?, date = ?, health_status = ?, summary = ? WHERE schedule_id = ?";
                const values = [animal_id, enclosure_id, employee_id, date, health_status, summary, schedule_id];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Feed Log updated successfully" }));
                });

            } else if (action === "delete") {
                if (!schedule_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Feed Schedule ID is required for deletion" }));
                    return;
                }
                const sql = "DELETE FROM feed_schedules WHERE schedule_id = ?";
                db_connection.query(sql, [schedule_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Feed log deleted successfully" }));
                });

            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid action" }));
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid JSON format" }));
        }
    });
};
module.exports = handleFeedForm;