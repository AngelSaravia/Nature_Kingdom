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
                        sql += `LEFT JOIN ${join.table} ON ${join.join_condition}`;
                    });
                }
            } else if (entity_type) {
                sql = `SELECT * FROM ${entity_type}`;
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Either entity_type or table1, table2, and join_condition are required" }));
                return;
            }
            Object.keys(filters).forEach((key) => {
                const value = filters[key];

                if (value !== undefined && value !== null && value !== "") {
                    // Handle specific table prefixes
                    if (key.startsWith('employees.')) {
                        handleEmployeeFilters(key, value, conditions, values);
                    } else if (key.startsWith('animals.')) {
                        handleAnimalFilters(key, value, conditions, values);
                    } else if (key.startsWith('visitors.') || key === 'membership_status') {           
                        handleVisitorFilters(key, value, conditions, values);
                    } else if (key.startsWith('enclosures.')) {
                        handleEnclosureFilters(key, value, conditions, values);
                    } else if (key.startsWith('events.')) {
                        handleEventFilters(key, value, conditions, values);
                    } else if (key.startsWith('tickets.')) {
                        handleTicketFilters(key, value, conditions, values);
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
function handleEnclosureFilters(key, value, conditions, values) {
    const fieldName = key.replace('enclosures.', '');
    if (key === 'exhibits.name') {
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
module.exports = { handleQueryReport };