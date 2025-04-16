// For the Ticket data entry form, NOT the same as 'ticket_helper'.
const db_connection = require("../database");

function handleTicketForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try{
            const formData = JSON.parse(body);
            const { action, ticket_id, visitor_id, price } = formData;
            const start_date = formData.start_date || null;
            const end_date = formData.end_date || null;
            const ticket_type = formData.ticket_type || null;
            const purchase_date = formData.purchase_date || null;
            if (action === "add") {
                if (!visitor_id || !price) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
                    return;
                }
                const sql = "INSERT INTO tickets (visitor_id, start_date, end_date, price, ticket_type, purchase_date) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [visitor_id, start_date, end_date, price, ticket_type, purchase_date];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database insert error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Ticket added successfully", id: result.insertId }));
                });

            } else if (action === "update") {
                if (!visitor_id || !price) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
                    return;
                }
                const sql = "UPDATE tickets SET visitor_id = ?, start_date = ?, end_date = ?, price = ?, ticket_type = ?, purchase_date = ? WHERE ticket_id = ?";
                const values = [visitor_id, start_date, end_date, price, ticket_type, purchase_date, ticket_id];
                db_connection.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Database update error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Ticket updated successfully" }));
                });

            } else if (action === "delete") {
                if (!ticket_id) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Ticket ID is required for deletion" }));
                    return;
                }
                const sql = "DELETE FROM tickets WHERE ticket_id = ?";
                db_connection.query(sql, [ticket_id], (err, result) => {
                    if (err) {
                        console.error("Database delete error:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Database error" }));
                        return;
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "Ticket deleted successfully" }));
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
module.exports = handleTicketForm;