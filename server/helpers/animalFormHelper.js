const db_connection = require("../database");

function handleAnimalForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const formData = JSON.parse(body);
            const { action, animal_id, animal_name, date_of_birth, enclosure_id, species, animal_type, health_status } = formData;

            if (action === "add") {
                // INSERT operation
                if (!animal_name || !date_of_birth || !enclosure_id || !species || !animal_type || !health_status) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }

                const sql = "INSERT INTO animals (animal_name, date_of_birth, enclosure_id, species, animal_type, health_status) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [animal_name, date_of_birth, enclosure_id, species, animal_type, health_status];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Animal added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                // UPDATE operation
                if (!animal_id || !animal_name || !date_of_birth || !enclosure_id || !species || !animal_type || !health_status) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }

                const sql = "UPDATE animals SET animal_name = ?, date_of_birth = ?, enclosure_id = ?, species = ?, animal_type = ?, health_status = ? WHERE animal_id = ?";
                const values = [animal_name, date_of_birth, enclosure_id, species, animal_type, health_status, animal_id];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Animal updated successfully" }));
                });

            } else if (action === "delete") {
                // DELETE operation
                if (!animal_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Animal ID is required for deletion" }));
                    return;
                }

                const sql = "DELETE FROM animals WHERE animal_id = ?";
                db_connection.query(sql, [animal_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Animal deleted successfully" }));
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
module.exports = handleAnimalForm;