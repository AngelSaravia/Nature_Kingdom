require("dotenv").config();  
const getParseData = require("../utils/getParseData");  
const db_connection = require("../database");

const handleQueryReport = (req, res) => {
    let body = "";
    
    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const queryParams = JSON.parse(body);
            const { entity_type, ...filters } = queryParams;

            if (!entity_type) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Entity type is required" }));
                return;
            }

            let sql = `SELECT * FROM ${entity_type}`;
            const conditions = [];
            const values = [];

            Object.keys(filters).forEach((key) => {
                if (filters[key] && filters[key].length > 0) {
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
            console.error("Error parsing request body:", error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
        }
    });
};

module.exports = { handleQueryReport };