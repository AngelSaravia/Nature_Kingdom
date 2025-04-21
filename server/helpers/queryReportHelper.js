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
      const {
        entity_type,
        table1,
        table2,
        join_condition,
        additional_joins = [],
        computed_fields,
        ...filters
      } = queryParams;
      const revenueFilters = queryParams.filters || {}; //flattens filters, fix for revenue report
      console.log("Filters received in the backend:", filters); // Debugging line

      let sql;
      const conditions = [];
      const values = [];
      if (entity_type === "orders") {
        sql = handleOrdersQuery(filters, conditions, values);
        skipDefaultSelect = true; // Skip default SELECT for orders
      } else if (entity_type === "order_items") {
        sql = handleOrderItemsQuery(filters, conditions, values);
        skipDefaultSelect = true; // Skip default SELECT for order_items
      } else if (table1 && table2 && join_condition) {
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
                handleRevenueFilters(
                  key.replace("revenue.", ""),
                  value,
                  conditions,
                  values
                );
              } else if (key === "product type") {
                // Ensure product type is handled
                handleRevenueFilters(key, value, conditions, values);
              }
            }
          });
          // Construct the revenue query with conditions
          sql = constructRevenueQuery(conditions);
        } else if (!skipDefaultSelect) {
          // Only use default SELECT if not skipped
          sql = `SELECT * FROM ${entity_type}`;
        } else {
          sql = `SELECT * FROM ${entity_type}`;
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              "Either entity_type or table1, table2, and join_condition are required",
          })
        );
        return;
      }
      if (entity_type !== "revenue") {
        Object.keys(filters).forEach((key) => {
          const value = filters[key];

          if (value !== undefined && value !== null && value !== "") {
            // Handle specific table prefixes
            if (key.startsWith("employees.")) {
              handleEmployeeFilters(key, value, conditions, values);
            } else if (key.startsWith("animals.")) {
              handleAnimalFilters(key, value, conditions, values);
            } else if (
              key.startsWith("visitors.") ||
              key === "membership_status"
            ) {
              handleVisitorFilters(key, value, conditions, values);
            } else if (key.startsWith("enclosures.")) {
              if (entity_type === "medical_records") {
                handleMedicalRecordsFilters(key, value, conditions, values);
              } else if (entity_type === "feed_schedules") {
                handleFeedLogsFilters(key, value, conditions, values);
              } else if (entity_type === "animals") {
                handleAnimalEnclosureFilters(key, value, conditions, values);
              } else if (entity_type === "enclosures") {
                handleEnclosureFilters(
                  key,
                  value,
                  conditions,
                  values,
                  entity_type
                );
              }
            } else if (key.startsWith("events.")) {
              handleEventFilters(key, value, conditions, values);
            } else if (key.startsWith("tickets.")) {
              handleTicketFilters(key, value, conditions, values);
            } else if (key.startsWith("feed_schedules.")) {
              handleFeedLogsFilters(key, value, conditions, values);
            } else if (key.startsWith("medical_records.")) {
              handleMedicalRecordsFilters(key, value, conditions, values);
            } else if (key === "exhibits.name") {
              const valueArray = Array.isArray(value) ? value : [value];
              conditions.push(
                `exhibits.name IN (${valueArray.map(() => "?").join(", ")})`
              );
              values.push(...valueArray);
            } else if (key.includes(".")) {
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
        if (!sql.includes("WHERE")) {
          //fix for giftshopsales filters
          sql += ` WHERE ${conditions.join(" AND ")}`;
        } else {
          console.warn(
            "Duplicate WHERE clause detected. Skipping additional WHERE clause."
          );
        }
      }
      console.log("Final SQL Query:", sql);
      console.log("Query Values:", values);
      db_connection.query(sql, values, (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Database error" })
          );
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
const handleOrdersQuery = (filters, conditions, values) => {
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "order_dateMin") {
        conditions.push("DATE(order_date) >= ?");
        values.push(value);
      } else if (key === "order_dateMax") {
        conditions.push("DATE(order_date) <= ?");
        values.push(value);
      } else if (key === "visitor_id") {
        conditions.push("visitor_id = ?");
        values.push(value);
      } else {
        // Handle other order fields if needed
        console.warn(`Unexpected filter key: ${key}`); // Log unexpected keys for debugging
        conditions.push(`${key} = ?`);
        values.push(value);
      }
    }
  });
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return `SELECT order_id, visitor_id, order_date, total_amount FROM orders ${whereClause}`;
};

const handleOrderItemsQuery = (filters, conditions, values) => {
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== "") {
      if (key === "order_dateMin") {
        conditions.push("DATE(orders.order_date) >= ?");
        values.push(value);
      } else if (key === "order_dateMax") {
        conditions.push("DATE(orders.order_date) <= ?");
        values.push(value);
      } else if (key === "product_name") {
        conditions.push("products.name LIKE ?");
        values.push(`%${value}%`);
      } else if (key === "quantityMin") {
        conditions.push("order_items.quantity >= ?");
        values.push(value);
      } else if (key === "quantityMax") {
        conditions.push("order_items.quantity <= ?");
        values.push(value);
      } else {
        console.warn(`Unexpected filter key: ${key}`); // Log unexpected keys for debugging
        conditions.push(`order_items.${key} = ?`);
        values.push(value);
      }
    }
  });
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
        SELECT 
            order_items.order_id, 
            products.name AS product_name, 
            order_items.quantity, 
            order_items.total_amount
        FROM order_items
        INNER JOIN products ON order_items.product_id = products.product_id
        INNER JOIN orders ON order_items.order_id = orders.order_id
        ${whereClause}
    `;
  console.log("Constructed SQL Query from orderitems:", sql); // Debugging log
  console.log("Conditions:", conditions); // Debugging log
  console.log("Values:", values); // Debugging log
  return sql;
};
// Helper functions for different table filters
function handleEmployeeFilters(key, value, conditions, values) {
  const fieldName = key.replace("employees.", "");
  if (key.endsWith("Min")) {
    const field = key.replace("Min", "");
    conditions.push(`${field} >= ?`);
    values.push(value);
  } else if (key.endsWith("Max")) {
    const field = key.replace("Max", "");
    conditions.push(`${field} <= ?`);
    values.push(value);
  } else if (fieldName === "gender") {
    const valueArray = Array.isArray(value) ? value : value.split(",");
    conditions.push(
      `employees.gender IN (${valueArray.map(() => "?").join(", ")})`
    );
    values.push(...valueArray);
  } else if (["zip_code"].includes(fieldName)) {
    conditions.push(`${key} = ?`);
    values.push(value);
  } else {
    conditions.push(`${key} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleAnimalFilters(key, value, conditions, values) {
  const fieldName = key.replace("animals.", "");
  if (key.endsWith("Min")) {
    const field = key.replace("Min", "");
    conditions.push(`${field} >= ?`);
    values.push(value);
  } else if (key.endsWith("Max")) {
    const field = key.replace("Max", "");
    conditions.push(`${field} <= ?`);
    values.push(value);
  } else if (["animal_type", "health_status"].includes(fieldName)) {
    const valueArray = Array.isArray(value) ? value : value.split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `animals.${fieldName} IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else if (key === "enclosures.name") {
    console.log("Processing enclosures.name filter with value:", value); // Debugging
    const valueArray = Array.isArray(value) ? value : value.split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `enclosures.name IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else {
    console.log("Falling into else block for key:", key); // Debugging log
    conditions.push(`${key} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleAnimalEnclosureFilters(key, value, conditions, values) {
  if (key === "enclosures.name") {
    const valueArray = Array.isArray(value) ? value : value.split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `enclosures.name IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else {
    console.log("Unhandled filter for Animal Enclosure:", key); // Debugging
  }
}
function handleVisitorFilters(key, value, conditions, values) {
  const fieldName = key.replace("visitors.", "");

  if (key === "membership_status") {
    // Handle membership status based on memberships table
    const valueArray = Array.isArray(value) ? value : [value];
    const statusConditions = [];

    if (valueArray.includes("active")) {
      statusConditions.push("memberships.visitor_id IS NOT NULL");
    }
    if (valueArray.includes("inactive")) {
      statusConditions.push("memberships.visitor_id IS NULL");
    }

    if (statusConditions.length > 0) {
      if (valueArray.length === 1) {
        // If only one status selected, use direct condition
        conditions.push(statusConditions[0]);
      } else {
        // If both statuses selected, use OR
        conditions.push(`(${statusConditions.join(" OR ")})`);
      }
    }
  } else if (key === "visitors.date_of_birthMin") {
    // Handle minimum date of birth
    conditions.push("visitors.date_of_birth >= ?");
    values.push(value);
  } else if (key === "visitors.date_of_birthMax") {
    // Handle maximum date of birth
    conditions.push("visitors.date_of_birth <= ?");
    values.push(value);
  } else if (fieldName === "gender") {
    const valueArray = Array.isArray(value) ? value : [value];
    if (valueArray.length > 0) {
      conditions.push(
        `visitors.gender IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else if (["zipcode"].includes(fieldName)) {
    conditions.push(`visitors.${fieldName} = ?`);
    values.push(value);
  } else {
    // Handle text fields with LIKE
    conditions.push(`visitors.${fieldName} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleEnclosureFilters(key, value, conditions, values, entity_type) {
  const fieldName = key.replace("enclosures.", "");
  if (key === "enclosures.name") {
    const valueArray = Array.isArray(value) ? value : [value];
    valueArray.forEach((val) => {
      conditions.push(`enclosures.name LIKE ?`);
      values.push(`%${val}%`);
    });
  } else if (key === "exhibits.name") {
    const valueArray = Array.isArray(value)
      ? value
      : value.toString().split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `exhibits.name IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else if (["status", "temp_control"].includes(fieldName)) {
    const valueArray = Array.isArray(value) ? value : [value];
    if (valueArray.length > 0) {
      conditions.push(
        `enclosures.${fieldName} IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else if (fieldName === "opens_at" || fieldName === "closes_at") {
    conditions.push(`enclosures.${fieldName} = ?`);
    values.push(value);
  } else if (fieldName === "location") {
    conditions.push(`enclosures.${fieldName} LIKE ?`);
    values.push(`%${value}%`);
  } else if (["current_capacity", "capacity"].includes(fieldName)) {
    conditions.push(`${key} = ?`);
    values.push(value);
  } else {
    conditions.push(`enclosures.${fieldName} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleEventFilters(key, value, conditions, values) {
  const fieldName = key.replace("events.", "");
  if (key.endsWith("Min")) {
    const field = key.replace("Min", "");
    if (field === "duration") {
      //converting duration to total seconds and comparing
      conditions.push(`TIME_TO_SEC(events.${field}) >= TIME_TO_SEC(?)`);
      values.push(value);
    } else {
      conditions.push(`${field} >= ?`);
      values.push(value);
    }
  } else if (key.endsWith("Max")) {
    const field = key.replace("Max", "");
    if (field === "duration") {
      conditions.push(`TIME_TO_SEC(events.${field}) <= TIME_TO_SEC(?)`);
      values.push(value);
    } else {
      conditions.push(`${field} <= ?`);
      values.push(value);
    }
  } else if (fieldName === "eventType") {
    const valueArray = Array.isArray(value) ? value : value.split(",");
    conditions.push(
      `events.eventType IN (${valueArray.map(() => "?").join(", ")})`
    );
    values.push(...valueArray);
  } else if (["capacity", "price"].includes(fieldName)) {
    conditions.push(`${key} = ?`);
    values.push(value);
  } else if (key === "events.eventDate") {
    conditions.push(`DATE(events.eventDate) = ?`);
    values.push(value);
  } else {
    conditions.push(`${key} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleTicketFilters(key, value, conditions, values) {
  const fieldName = key.replace("tickets.", "");

  if (key === "tickets.start_date") {
    conditions.push(`DATE(tickets.start_date) = ?`);
    values.push(value);
  } else if (key === "tickets.end_date") {
    conditions.push(`DATE(tickets.end_date) = ?`);
    values.push(value);
  } else if (key === "tickets.purchase_dateMin") {
    conditions.push(`DATE(tickets.purchase_date) >= ?`);
    values.push(value);
  } else if (key === "tickets.purchase_dateMax") {
    conditions.push(`DATE(tickets.purchase_date) <= ?`);
    values.push(value);
  } else if (fieldName === "ticket_type") {
    // Handle ticket type as an array
    const valueArray = Array.isArray(value) ? value : [value];
    if (valueArray.length > 0) {
      conditions.push(
        `tickets.ticket_type IN (${valueArray.map(() => "?").join(", ")})`
      );
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
  if (key === "product type") {
    const allowedTypes = ["ticket", "membership", "Giftshop Order"];
    const validTypes = Array.isArray(value)
      ? value.filter((type) => allowedTypes.includes(type))
      : [];
    if (validTypes.length > 0) {
      conditions.push(
        `type_of_product IN (${validTypes.map(() => "?").join(", ")})`
      );
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

// Backend Change: Modify constructRevenueQuery Function
function constructRevenueQuery(conditions) {
  let sql = `
          SELECT * FROM (
              SELECT 
                  ticket_id AS tuple_id, 
                  'ticket' AS type_of_product, 
                  price,
                  visitor_id,
                  DATE(purchase_date) AS purchase_date 
              FROM tickets
              UNION ALL
              SELECT 
                  membership_id AS tuple_id, 
                  'membership' AS type_of_product, 
                  79.99 AS price,
                  visitor_id, 
                  DATE(start_date) AS purchase_date 
              FROM memberships
              UNION ALL
              SELECT 
                  order_id AS tuple_id, 
                  'Giftshop Order' AS type_of_product, 
                  total_amount AS price,
                  visitor_id,
                  DATE(order_date) AS purchase_date 
              FROM orders
          ) AS revenue_data
      `;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Add ORDER BY clause for sorting
  sql += `
            ORDER BY 
                CASE 
                    WHEN type_of_product = 'ticket' THEN 1
                    WHEN type_of_product = 'membership' THEN 2
                    WHEN type_of_product = 'Giftshop Order' THEN 3
                    ELSE 4
                END,
                purchase_date DESC
        `;

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
    conditions.push(
      `CONCAT(employees.first_name, ' ', employees.last_name) LIKE ?`
    );
    values.push(`%${value}%`);
  } else if (key === "feed_schedules.health_status") {
    const valueArray = Array.isArray(value) ? value : value.split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `(${valueArray
          .map(() => `feed_schedules.health_status = ?`)
          .join(" OR ")})`
      );
      values.push(...valueArray);
    }
  }
}
function handleMedicalRecordsFilters(key, value, conditions, values) {
  console.log(
    "Processing filter in handleMedicalRecordsFilters:",
    key,
    "Value:",
    value
  ); // Debugging

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
      conditions.push(
        `(${valueArray.map(() => `animals.health_status = ?`).join(" OR ")})`
      );
      values.push(...valueArray);
    }
  } else if (key === "medical_records.record_type") {
    // Handle record type filter
    const valueArray = Array.isArray(value) ? value : value.split(",");
    if (valueArray.length > 0) {
      conditions.push(
        `(${valueArray
          .map(() => `medical_records.record_type = ?`)
          .join(" OR ")})`
      );
      values.push(...valueArray);
    }
  }
}
function handleGenericPrefixedFilters(key, value, conditions, values) {
  if (key.endsWith("Min")) {
    const field = key.replace("Min", "");
    conditions.push(`${field} >= ?`);
    values.push(value);
  } else if (key.endsWith("Max")) {
    const field = key.replace("Max", "");
    conditions.push(`${field} <= ?`);
    values.push(value);
  } else {
    conditions.push(`${key} LIKE ?`);
    values.push(`%${value}%`);
  }
}
function handleUnprefixedFilters(key, value, table1, conditions, values) {
  if (typeof value === "string" && value.includes(",")) {
    const valueArray = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (valueArray.length > 0) {
      conditions.push(
        `${table1}.${key} IN (${valueArray.map(() => "?").join(", ")})`
      );
      values.push(...valueArray);
    }
  } else {
    conditions.push(`${table1}.${key} = ?`);
    values.push(value);
  }
}
const handleDistinctValuesForMedicalRecords = (req, res) => {
  //for dropdowns in medical records report
  const { field, table } = req.query;

  // Restrict to specific tables for medical records
  const allowedTables = ["employees", "enclosures", "animals"];
  if (!field || !table || !allowedTables.includes(table)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "Invalid field or table for medical records",
      })
    );
    return;
  }

  const sql = `
        SELECT DISTINCT ${table}.${field} 
        FROM medical_records
        LEFT JOIN animals ON medical_records.animal_id = animals.animal_id
        LEFT JOIN employees ON medical_records.employee_id = employees.Employee_id
        LEFT JOIN enclosures ON medical_records.enclosure_id = enclosures.enclosure_id
    `;
  db_connection.query(sql, [], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Database error" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: true, data: results.map((row) => row[field]) })
    );
  });
};
module.exports = { handleQueryReport, handleDistinctValuesForMedicalRecords };
