const db_connection = require("../database");

function handleCalendar(req, res) {
    try {
        const query = `
            SELECT 
                eventID as id,
                eventName,
                description,
                eventDate,
                duration,
                location,
                capacity,
                price,
                managerID,
                eventType
            FROM events
            ORDER BY eventDate ASC
        `;
        
        db_connection.query(query, (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return sendErrorResponse(res, 500, "Database error");
            }
            
            const formattedEvents = results.map(event => ({
                ...event,
                eventDate: new Date(event.eventDate).toISOString()
            }));
            
            sendSuccessResponse(res, { events: formattedEvents });
        });
    } catch (error) {
        console.error("Server error:", error);
        sendErrorResponse(res, 500, "Server error");
    }
}

// Helper functions for consistent responses
function sendSuccessResponse(res, data = {}) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, ...data }));
}

function sendErrorResponse(res, statusCode = 500, message = "Error occurred") {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message }));
}

module.exports = handleCalendar;