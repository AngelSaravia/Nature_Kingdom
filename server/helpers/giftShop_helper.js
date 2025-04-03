const db_connection = require("../database");
const url = require("url");

function handleGiftShop(req, res) {
    try {
        const parsedUrl = url.parse(req.url, true); 
        const { category, name } = parsedUrl.query;  // Ensure proper query parsing

        let query = `
            SELECT 
                product_id, 
                shop_id, 
                name, 
                price, 
                amount_stock, 
                category 
            FROM products
        `;

        let conditions = [];
        let values = [];

        if (category) {
            conditions.push("category = ?");
            values.push(category);
        }
        if (name) {
            conditions.push("name LIKE ?");
            values.push(`%${name}%`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY name ASC";

        // Ensure the database connection is valid before querying
        if (!db_connection) {
            return sendErrorResponse(res, 500, "Database connection error");
        }

        db_connection.query(query, values, (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return sendErrorResponse(res, 500, "Database error");
            }

            // If no products are found, return a meaningful message
            if (results.length === 0) {
                return sendSuccessResponse(res, { products: [], message: "No products found" });
            }

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

module.exports = handleGiftShop;
