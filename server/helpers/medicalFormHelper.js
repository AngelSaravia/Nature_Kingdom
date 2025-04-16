const db_connection = require("../database");

function handleMedicalForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const formData = JSON.parse(body);
            console.log("Received formData:", formData);
            const { action, record_id, animal_id, employee_id, enclosure_id, location, record_type } = formData;
            const date = formData.date || null; // optional, can be null
            const diagnosis = formData.diagnosis || null;
            const treatment = formData.treatment || null;
            const followup = formData.followup || null;
            const additional = formData.additional || null;

            if (action === "add") {
                if (!animal_id || !employee_id || !enclosure_id || !location || !record_type) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }

                const sql = "INSERT INTO medical_records (animal_id, employee_id, enclosure_id, location, date, record_type, diagnosis, treatment, followup, additional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [animal_id, employee_id, enclosure_id, location, date, record_type, diagnosis, treatment, followup, additional];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Medical record added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                if (!record_id || !animal_id || !employee_id || !enclosure_id || !location || !record_type) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }

                const sql = "UPDATE medical_records SET animal_id = ?, employee_id = ?, enclosure_id = ?, location = ?, date = ?, record_type = ?, diagnosis = ?, treatment = ?, followup = ?, additional = ? WHERE record_id = ?";
                const values = [animal_id, employee_id, enclosure_id, location, date, record_type, diagnosis, treatment, followup, additional, record_id];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Medical record updated successfully" }));
                });

            } else if (action === "delete") {
                if (!record_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Record ID is required for deletion" }));
                    return;
                }

                const sql = "DELETE FROM medical_records WHERE record_id = ?";
                db_connection.query(sql, [record_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Medical record deleted successfully" }));
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
}
module.exports = handleMedicalForm;