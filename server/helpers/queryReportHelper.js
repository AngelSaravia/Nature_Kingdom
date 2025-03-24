require("dotenv").config();  
const getParseData = require("../utils/getParseData");  
const db_connection = require("../database");

/**
 * Handling fetch query reports based on entity type and filters.
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 */
const handleQueryReport = (req, res) => {
    try {
        const queryParams = getParseData(req);
        const { entity, ...filters } = queryParams;

        if (!entity) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Entity type is required" }));
            return;
        }

        let sql = `SELECT * FROM ${entity}`;
        const conditions = [];
        const values = [];

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                conditions.push(`${key} = ?`);
                values.push(filters[key]);
            }
        });

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }

        db_connection.query(sql, values, (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Database error" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, data: results }));
        });
    } catch (error) {
        console.error("Error handling query report:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Internal server error" }));
    }
};

module.exports = { handleQueryReport };
