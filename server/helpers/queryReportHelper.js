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
            const { entity_type, table1, table2, join_condition, additional_joins = [], computed_fields, ...filters } = queryParams;

            let sql;
            const conditions = [];
            const values = [];
            if (table1 && table2 && join_condition) {
                // Handles join queries
                sql = `
                    SELECT ${computed_fields || `${table1}.*, ${table2}.*`} 
                    FROM ${table1} 
                    LEFT JOIN ${table2} 
                    ON ${join_condition}
                `;

                // Add additional joins dynamically
                if (Array.isArray(additional_joins)) {
                    additional_joins.forEach((join) => {
                        sql += `
                            LEFT JOIN ${join.table} 
                            ON ${join.join_condition}
                        `;
                    });
                }
            } else if (entity_type) {
                // Handles single-table queries
                sql = `SELECT * FROM ${entity_type}`;
            } else {
                // If entity_type or join parameters are not provided, return error
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Either entity_type or table1, table2, and join_condition are required" }));
                return;
            }

            Object.keys(filters).forEach((key) => {
                const value = filters[key];

                if (value !== undefined && value !== null && value !== "") {
                    if (key === "manager_name") {
                        // Filter by manager name
                        conditions.push(`CONCAT(employees.first_name, ' ', employees.last_name) LIKE ?`);
                        values.push(`%${value}%`);
                    } else if (key === "exhibit_name") {
                        const exhibitsJoined = additional_joins.some(join => join.table === "exhibits");
                        if (!exhibitsJoined) {
                            sql += ` LEFT JOIN exhibits ON ${table1}.exhibit_id = exhibits.exhibits_id`;
                        }
                        conditions.push(`exhibits.name IN (${value.split(",").map(() => "?").join(", ")})`);
                        values.push(...value.split(","));
                    } else if (key === "membership_status") {
                        // Filter by membership status (active or inactive)
                        conditions.push(`CASE WHEN ${table2}.visitor_id IS NOT NULL THEN 'active' ELSE 'inactive' END = ?`);
                        values.push(value);


                    } else if (key === "start_date") {
                        // Handle start_date as a range filter (greater than or equal)
                        conditions.push(`start_date >= ?`);
                        values.push(value);
                    } else if (key === "end_date") {
                        // Handle end_date as a range filter (less than or equal)
                        conditions.push(`end_date <= ?`);
                        values.push(value);
                    } else if (key.endsWith("Min")) {
                        // Handling minimum range filtering
                        const field = key.replace("Min", ""); 
                        conditions.push(`${field} >= ?`);
                        values.push(value);
                    } else if (key.endsWith("Max")) {
                        // Handling maximum range filtering
                        const field = key.replace("Max", ""); 
                        conditions.push(`${field} <= ?`);
                        values.push(value);
                    } else if (typeof value === "string" && value.includes(",")) {
                        // Handling multi-value filtering
                        const valueArray = value.split(",").map((v) => v.trim()); 
                        conditions.push(`${key} IN (${valueArray.map(() => "?").join(", ")})`);
                        values.push(...valueArray);
                        
                        
                    } else {
                        // Handling exact matches
                        conditions.push(`${key} = ?`);
                        values.push(value);
                    }
                }
            });

            if (conditions.length > 0) {
                sql += ` WHERE ${conditions.join(" AND ")}`;
            }
            // Log the generated SQL query for debugging
            console.log("Generated SQL Query:", sql);
            console.log("With Values:", values);

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