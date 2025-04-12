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
            const revenueFilters = queryParams.filters || {}; //flattens filters, fix for revenue report
            console.log("Filters received in the backend:", filters); // Debugging line

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
                        sql += ` LEFT JOIN ${join.table} ON ${join.join_condition}`;
                    });
                }
            } else if (entity_type) {
                if (entity_type === "revenue") {
                    // Process revenue-specific filters
                    Object.keys(revenueFilters).forEach((key) => {
                        const value = revenueFilters[key];
                        if (value !== undefined && value !== null && value !== "") {
                            if (key.startsWith("revenue.")) {
                                handleRevenueFilters(key.replace("revenue.", ""), value, conditions, values);
                            }
                        }
                    });
                    // Construct the revenue query with conditions
                    sql = constructRevenueQuery(conditions);
                } else {
                    sql = `SELECT * FROM ${entity_type}`;
                }
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Either entity_type or table1, table2, and join_condition are required" }));
                return;
            }
            if (entity_type !== "revenue") {
                Object.keys(filters).forEach((key) => {
                    const value = filters[key];
                    console.log("Processing filter:", key, "Value:", value); // Debugging line

                    if (value !== undefined && value !== null && value !== "") {
                        // Handle specific table prefixes
                        if (key.startsWith('employees.')) {
                            handleEmployeeFilters(key, value, conditions, values);
                        } else if (key.startsWith('animals.')) {
                            handleAnimalFilters(key, value, conditions, values);
                        } else if (key.startsWith('visitors.') || key === 'membership_status') {           
                            handleVisitorFilters(key, value, conditions, values);
                        } else if (key.startsWith('enclosures.')) {
                            handleEnclosureFilters(key, value, conditions, values, entity_type);
                        } else if (key.startsWith('events.')) {
                            handleEventFilters(key, value, conditions, values);
                        } else if (key.startsWith('tickets.')) {
                            handleTicketFilters(key, value, conditions, values);
                        } else if (key.startsWith('feed_schedules.')) {
                            handleFeedLogsFilters(key, value, conditions, values);
                        } else if (key.startsWith('medical_records.')) {
                            handleMedicalRecordsFilters(key, value, conditions, values);
                        } else if (key === 'exhibits.name') { 
                            const valueArray = Array.isArray(value) ? value : [value];
                            conditions.push(`exhibits.name IN (${valueArray.map(() => '?').join(', ')})`);
                            values.push(...valueArray);
                        } else if (key.includes('.')) {
                            // Generic handling for other prefixed fields
                            handleGenericPrefixedFilters(key, value, conditions, values);
                        } else {
                            // Handle unprefixed fields
                            handleUnprefixedFilters(key, value, table1, conditions, values);
                        }
                    }
                });
            }
            if (entity_type !== "revenue" && conditions.length > 0) {
                sql += ` WHERE ${conditions.join(" AND ")}`;
            }
            console.log("Constructed SQL Query:", sql);
            console.log("Conditions:", conditions); // Debug line
            console.log("Values:", values);
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
// Helper functions for different table filters
function handleEmployeeFilters(key, value, conditions, values) {
    const fieldName = key.replace('employees.', '');
    if (key.endsWith('Min')) {
        const field = key.replace('Min', '');
        conditions.push(`${field} >= ?`);
        values.push(value);
    } else if (key.endsWith('Max')) {
        const field = key.replace('Max', '');
        conditions.push(`${field} <= ?`);
        values.push(value);
    } else if (fieldName === 'gender') {
        const valueArray = Array.isArray(value) ? value : value.split(',');
        conditions.push(`employees.gender IN (${valueArray.map(() => '?').join(', ')})`);
        values.push(...valueArray);
    } else if (['salary', 'zip_code'].includes(fieldName)) {
        conditions.push(`${key} = ?`);
        values.push(value);
    } else {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleAnimalFilters(key, value, conditions, values) {
    const fieldName = key.replace('animals.', '');
    if (key.endsWith('Min')) {
        const field = key.replace('Min', '');
        conditions.push(`${field} >= ?`);
        values.push(value);
    } else if (key.endsWith('Max')) {
        const field = key.replace('Max', '');
        conditions.push(`${field} <= ?`);
        values.push(value);
    } else if (['animal_type', 'health_status'].includes(fieldName)) {
        const valueArray = Array.isArray(value) ? value : value.split(',');
        if (valueArray.length > 0) {
            conditions.push(`animals.${fieldName} IN (${valueArray.map(() => '?').join(', ')})`);
            values.push(...valueArray);
        }
    } else if (key === "enclosures.name") {
        const valueArray = Array.isArray(value) ? value : value.split(',');
        if (valueArray.length > 0) {
            conditions.push(`enclosures.name IN (${valueArray.map(() => '?').join(', ')})`);
            values.push(...valueArray);
        }
    } else {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleVisitorFilters(key, value, conditions, values) {
    const fieldName = key.replace('visitors.', '');
    
    if (key === 'membership_status') {
        // Handle membership status based on memberships table
        const valueArray = Array.isArray(value) ? value : [value];
        const statusConditions = [];
        
        if (valueArray.includes('active')) {
            statusConditions.push('memberships.visitor_id IS NOT NULL');
        }
        if (valueArray.includes('inactive')) {
            statusConditions.push('memberships.visitor_id IS NULL');
        }
        
        if (statusConditions.length > 0) {
            if (valueArray.length === 1) {
                // If only one status selected, use direct condition
                conditions.push(statusConditions[0]);
            } else {
                // If both statuses selected, use OR
                conditions.push(`(${statusConditions.join(' OR ')})`);
            }
        }

    } else if (key === 'visitors.date_of_birthMin') {
        // Handle minimum date of birth
        conditions.push('visitors.date_of_birth >= ?');
        values.push(value);
    } else if (key === 'visitors.date_of_birthMax') {
        // Handle maximum date of birth
        conditions.push('visitors.date_of_birth <= ?');
        values.push(value);
    } else if (fieldName === 'gender') {
        const valueArray = Array.isArray(value) ? value : [value];
        if (valueArray.length > 0) {
            conditions.push(`visitors.gender IN (${valueArray.map(() => '?').join(', ')})`);
            values.push(...valueArray);
        }
    } else if (['zipcode'].includes(fieldName)) {
        conditions.push(`visitors.${fieldName} = ?`);
        values.push(value);
    } else {
        // Handle text fields with LIKE
        conditions.push(`visitors.${fieldName} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleEnclosureFilters(key, value, conditions, values, entity_type) {
    const fieldName = key.replace('enclosures.', '');
    if (key === 'name') {
        if (entity_type === 'animals') {
            // Use IN for animals query report
            const valueArray = Array.isArray(value) ? value : value.split(',');
            if (valueArray.length > 0) {
                conditions.push(`enclosures.name IN (${valueArray.map(() => '?').join(', ')})`);
                values.push(...valueArray);
            }
        } else {
            // Use LIKE for this report
            conditions.push(`enclosures.name LIKE ?`);
            values.push(`%${value}%`);
        } 
    } else if (key === 'exhibits.name') {
        const valueArray = Array.isArray(value) ? value : value.toString().split(',');
        if (valueArray.length > 0) {
            conditions.push(`exhibits.name IN (${valueArray.map(() => '?').join(', ')})`);
            values.push(...valueArray);
        }
    } else if (['status', 'temp_control'].includes(fieldName)) {
        const valueArray = Array.isArray(value) ? value : [value];
        conditions.push(`enclosures.${fieldName} IN (${valueArray.map(() => '?').join(', ')})`);
        values.push(...valueArray);
    } else if (fieldName === 'location') {
        conditions.push(`enclosures.${fieldName} LIKE ?`);
        values.push(`%${value}%`);
    } else if (['current_capacity', 'capacity'].includes(fieldName)) {
        conditions.push(`${key} = ?`);
        values.push(value);
    } else {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleEventFilters(key, value, conditions, values) {
    const fieldName = key.replace('events.', '');
    if (key.endsWith('Min')) {
        const field = key.replace('Min', '');
        if (field === 'duration') { //converting duration to total seconds and comparing
            conditions.push(`TIME_TO_SEC(events.${field}) >= TIME_TO_SEC(?)`);
            values.push(value);
        } else {
            conditions.push(`${field} >= ?`);
            values.push(value);
        }
    } else if (key.endsWith('Max')) {
        const field = key.replace('Max', '');
        if (field === 'duration') {
            conditions.push(`TIME_TO_SEC(events.${field}) <= TIME_TO_SEC(?)`);
            values.push(value);
        } else {
            conditions.push(`${field} <= ?`);
            values.push(value);
        }
    } else if (fieldName === 'eventType') {
        const valueArray = Array.isArray(value) ? value : value.split(',');
        conditions.push(`events.eventType IN (${valueArray.map(() => '?').join(', ')})`);
        values.push(...valueArray);
    } else if (['capacity', 'price'].includes(fieldName)) {
        conditions.push(`${key} = ?`);
        values.push(value);
    } else if (key === 'events.eventDate') {
        conditions.push(`DATE(events.eventDate) = ?`);
        values.push(value);
    } else {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleTicketFilters(key, value, conditions, values) {
    const fieldName = key.replace('tickets.', '');

    if (key === 'tickets.start_date') {
        conditions.push(`DATE(tickets.start_date) = ?`);
        values.push(value);
    } else if (key === 'tickets.end_date') {
        conditions.push(`DATE(tickets.end_date) = ?`);
        values.push(value);
    } else if (key === 'tickets.purchase_dateMin') {
        conditions.push(`DATE(tickets.purchase_date) >= ?`);
        values.push(value);
    } else if (key === 'tickets.purchase_dateMax') {
        conditions.push(`DATE(tickets.purchase_date) <= ?`);
        values.push(value);
    } else if (fieldName === 'ticket_type') {
        // Handle ticket type as an array
        const valueArray = Array.isArray(value) ? value : [value];
        if (valueArray.length > 0) {
            conditions.push(`tickets.ticket_type IN (${valueArray.map(() => '?').join(', ')})`);
            values.push(...valueArray);
        }
    } else {
        // Handle text fields with LIKE
        conditions.push(`tickets.${fieldName} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleRevenueFilters(key, value, conditions, values) {
    console.log("Processing revenue filter:", key, value); // Debug line
    if (key === "product_types") {
        const allowedTypes = ["ticket", "membership", "gift"];
        const validTypes = Array.isArray(value) ? value.filter(type => allowedTypes.includes(type)) : [];
        if (validTypes.length > 0) {
            conditions.push(`type_of_product IN (${validTypes.map(() => "?").join(", ")})`);
            values.push(...validTypes);
        }
    } else if (key === "start_date") {
        if (value) {
            conditions.push(`purchase_date >= DATE(?)`);
            values.push(value);
        }
    } else if (key === "end_date") {
        if (value) {
            conditions.push(`purchase_date <= DATE(?)`);
            values.push(value);
        }
    }
}

function constructRevenueQuery(conditions) {
    let sql = `
        SELECT * FROM (
            SELECT 
                ticket_id AS tuple_id, 
                'ticket' AS type_of_product, 
                price, 
                DATE(purchase_date) AS purchase_date 
            FROM tickets
            UNION ALL
            SELECT 
                membership_id AS tuple_id, 
                'membership' AS type_of_product, 
                79.99 AS price, 
                DATE(start_date) AS purchase_date 
            FROM memberships
            UNION ALL
            SELECT 
                order_id AS tuple_id, 
                'gift' AS type_of_product, 
                total_amount AS price, 
                DATE(order_date) AS purchase_date 
            FROM orders
        ) AS revenue_data
    `;

    // Add WHERE clause only if there are conditions
    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`; // Ensure only one WHERE clause
    }

    // Add ORDER BY clause for sorting
    sql += ` ORDER BY 
        CASE 
            WHEN type_of_product = 'ticket' THEN 1
            WHEN type_of_product = 'membership' THEN 2
            WHEN type_of_product = 'gift' THEN 3
        END, 
        tuple_id`;

    console.log("Constructed Revenue Query:", sql); // Debugging line
    console.log("Conditions:", conditions); // Debugging line

    return sql;
}
function handleFeedLogsFilters(key, value, conditions, values) {
    if (key === "feed_schedules.dateMin") {
        conditions.push(`DATE(feed_schedules.date) >= ?`);
        values.push(value);
    } else if (key === "feed_schedules.dateMax") {
        conditions.push(`DATE(feed_schedules.date) <= ?`);
        values.push(value);
    } else if (key === "animals.animal_name") {
        conditions.push(`animals.animal_name LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "enclosures.name") {
        conditions.push(`enclosures.name LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "CONCAT(employees.first_name, ' ', employees.last_name)") {
        conditions.push(`CONCAT(employees.first_name, ' ', employees.last_name) LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "feed_schedules.health_status") {
        const valueArray = Array.isArray(value) ? value : value.split(",");
        if (valueArray.length > 0) {
            conditions.push(`(${valueArray.map(() => `feed_schedules.health_status = ?`).join(" OR ")})`);
            values.push(...valueArray);
        }
    }
}
function handleMedicalRecordsFilters(key, value, conditions, values) {
    if (key === "medical_records.dateMin") {
        // Handle starting date of record
        conditions.push(`DATE(medical_records.date) >= ?`);
        values.push(value);
    } else if (key === "medical_records.dateMax") {
        // Handle ending date of record
        conditions.push(`DATE(medical_records.date) <= ?`);
        values.push(value);
    } else if (key === "animals.animal_name") {
        // Handle animal name filter
        conditions.push(`animals.animal_name LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "employees.email") {
        // Handle employee email filter
        conditions.push(`employees.email LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "enclosures.name") {
        // Handle enclosure name filter
        conditions.push(`enclosures.name LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "animals.species") {
        conditions.push(`animals.species LIKE ?`);
        values.push(`%${value}%`);
    } else if (key === "animals.health_status") {
        // Handle health status filter
        const valueArray = Array.isArray(value) ? value : value.split(",");
        if (valueArray.length > 0) {
            conditions.push(`(${valueArray.map(() => `animals.health_status = ?`).join(" OR ")})`);
            values.push(...valueArray);
        }
    } else if (key === "medical_records.record_type") {
        // Handle record type filter
        const valueArray = Array.isArray(value) ? value : value.split(",");
        if (valueArray.length > 0) {
            conditions.push(`(${valueArray.map(() => `medical_records.record_type = ?`).join(" OR ")})`);
            values.push(...valueArray);
        }
    }
}
function handleGenericPrefixedFilters(key, value, conditions, values) {
    if (key.endsWith('Min')) {
        const field = key.replace('Min', '');
        conditions.push(`${field} >= ?`);
        values.push(value);
    } else if (key.endsWith('Max')) {
        const field = key.replace('Max', '');
        conditions.push(`${field} <= ?`);
        values.push(value);
    } else {
        conditions.push(`${key} LIKE ?`);
        values.push(`%${value}%`);
    }
}
function handleUnprefixedFilters(key, value, table1, conditions, values) {
    if (typeof value === "string" && value.includes(",")) {
        const valueArray = value.split(",").map(v => v.trim()).filter(Boolean);
        if (valueArray.length > 0) {
            conditions.push(`${table1}.${key} IN (${valueArray.map(() => "?").join(", ")})`);
            values.push(...valueArray);
        }
    } else {
        conditions.push(`${table1}.${key} = ?`);
        values.push(value);
    }
}
const handleDistinctValuesForMedicalRecords = (req, res) => { //for dropdowns in medical records report
    const { field, table } = req.query;

    // Restrict to specific tables for medical records
    const allowedTables = ["employees", "enclosures", "animals"];
    if (!field || !table || !allowedTables.includes(table)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid field or table for medical records" }));
        return;
    }

    const sql = `SELECT DISTINCT ${field} FROM ${table}`;
    db_connection.query(sql, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results.map((row) => row[field]) }));
    });
};
module.exports = { handleQueryReport, handleDistinctValuesForMedicalRecords };