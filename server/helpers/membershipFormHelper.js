const db_connection = require("../database");

function handleMembershipForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const formData = JSON.parse(body);
            const { action, membership_id, visitor_id } = formData;
            const start_date = formData.start_date || null;
            const end_date = formData.end_date || null;
            const max_guests = formData.max_guests || null;
            if (action === "add") {
                if (!visitor_id ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }
                const sql = "INSERT INTO memberships (visitor_id, start_date, end_date, max_guests) VALUES (?, ?, ?, ?)";
                const values = [visitor_id, start_date, end_date, max_guests];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Membership added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                if (!visitor_id ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }
                const sql = "UPDATE memberships SET visitor_id = ?, start_date = ?, end_date = ?, max_guests = ? WHERE membership_id = ?";
                const values = [visitor_id, start_date, end_date, max_guests, membership_id];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Membership updated successfully" }));
                });

            } else if (action === "delete") {
                if (!membership_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Membership ID is required for deletion" }));
                    return;
                }
                const sql = "DELETE FROM memberships WHERE membership_id = ?";
                db_connection.query(sql, [membership_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Membership deleted successfully" }));
                });

            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid action" }));
            }
        } catch (error) {
            console.error("Error parsing request body:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid request body" }));
        }
    });
};
module.exports = handleMembershipForm;