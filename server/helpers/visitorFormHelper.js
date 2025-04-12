const db_connection = require("../database.js");

function handleVisitorForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const formData = JSON.parse(body);
            const { action, visitor_id, first_name, last_name, email, password, phone_number, date_of_birth } = formData;
            const Minit_name = formData.Minit_name || null;
            const username = formData.username || null;
            const gender = formData.gender || null;
            const street_address = formData.street_address || null;
            const city = formData.city || null;
            const state = formData.state || null;
            const zipcode = formData.zipcode || null;
            const country = formData.country || null;
            const role = formData.role || "customer"; // default to 'customer'
            if (action === "add") {
                if (!first_name || !last_name || !email || !password || !phone_number || !date_of_birth) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }
                const sql = "INSERT INTO visitors (first_name, Minit_name, last_name, username, password, email, phone_number, date_of_birth, gender, street_address, city, state, zipcode, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [first_name, Minit_name, last_name, username, password, email, phone_number, date_of_birth, gender, street_address, city, state, zipcode, country, role];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Visitor added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                if (!first_name || !last_name || !email || !password || !phone_number || !date_of_birth) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }
                const sql = "UPDATE visitors SET first_name = ?, Minit_name = ?, last_name = ?, username = ?, password = ?, email = ?, phone_number = ?, date_of_birth = ?, gender = ?, street_address = ?, city = ?, state = ?, zipcode = ?, country = ?, role = ? WHERE visitor_id = ?";
                const values = [first_name, Minit_name, last_name, username, password, email, phone_number, date_of_birth, gender, street_address, city, state, zipcode, country, role, visitor_id];

                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Visitor updated successfully" }));
                });

            } else if (action === "delete") {
                if (!visitor_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Visitor ID is required for deletion" }));
                    return;
                }
                const sql = "DELETE FROM visitors WHERE visitor_id = ?";
                db_connection.query(sql, [visitor_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Visitor deleted successfully" }));
                });

            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid action" }));
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
        }
    });
};
module.exports = handleVisitorForm;