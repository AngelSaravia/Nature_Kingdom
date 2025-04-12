const db_connection = require("../database");
const url = require("url");

function handleProductHistory(req, res) {
    try {
        // No query parameters are needed, so just proceed to query the product history.
        const queryString = `
            WITH alerts_with_product AS (
              SELECT 
                SUBSTRING(
                  alert_message,
                  LOCATE('"', alert_message) + 1,
                  LOCATE('"', alert_message, LOCATE('"', alert_message) + 1) - LOCATE('"', alert_message) - 1
                ) AS product_name,
                created_at,
                ROW_NUMBER() OVER (
                  PARTITION BY 
                    SUBSTRING(
                      alert_message,
                      LOCATE('"', alert_message) + 1,
                      LOCATE('"', alert_message, LOCATE('"', alert_message) + 1) - LOCATE('"', alert_message) - 1
                    )
                  ORDER BY created_at DESC
                ) AS rn
              FROM alerts
              WHERE alert_message LIKE 'Notice: Stock for product "% was replenished%'
            )
            SELECT 
              p.product_id,
              p.name,
              a.created_at AS last_stocked_on,
              SUM(o.quantity) AS total_sold
            FROM products p
            LEFT JOIN order_items o ON o.product_id = p.product_id
            LEFT JOIN gift_shop g ON p.shop_id = g.shop_id
            LEFT JOIN alerts_with_product a ON a.product_name = p.name AND a.rn = 1
            GROUP BY p.name, a.created_at
            ORDER BY p.product_id ASC;
        `;
        
        // Ensure the database connection is valid before querying
        if (!db_connection) {
            return sendErrorResponse(res, 500, "Database connection error");
        }

        // Execute the query
        db_connection.query(queryString, (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return sendErrorResponse(res, 500, "Database error");
            }

            // If no results are found, return a meaningful message
            if (results.length === 0) {
                return sendSuccessResponse(res, { products: [], message: "No product history found" });
            }

            // console.log("Query results:", results);
            sendSuccessResponse(res, { products: results });
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

module.exports = handleProductHistory;
