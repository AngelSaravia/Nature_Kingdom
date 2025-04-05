const db_connection = require('../database');

function handleGiftOrder(req, res, data) {
    try {
        const { username, shop_id, total_amount, items } = data;

        const visitorQuery = "SELECT visitor_id FROM visitors WHERE username = ?";

        db_connection.query(visitorQuery, [username], (err, visitorResult) => {
            if (err || !visitorResult.length) {
                return sendErrorResponse(res, 500, "Error finding visitor");
            }

            const visitor_id = visitorResult[0].visitor_id;

        // Start transaction
        db_connection.beginTransaction((err) => {
            if (err) {
                return sendErrorResponse(res, 500, "Transaction error");
            }

            

            // Create order
            const orderQuery = `
                INSERT INTO orders (visitor_id, shop_id, total_amount, payment_status) 
                VALUES (?, ?, ?, 'pending')
            `;

            db_connection.query(orderQuery, [visitor_id, shop_id, total_amount], (err, orderResult) => {
                if (err) {
                    return db_connection.rollback(() => {
                        sendErrorResponse(res, 500, "Error creating order");
                    });
                }

                const order_id = orderResult.insertId;

                // Prepare order items
                const orderItemsQuery = `
                    INSERT INTO order_items 
                    (order_id, product_id, quantity, price, total_amount) 
                    VALUES ?
                `;

                const orderItemsValues = items.map(item => [
                    order_id,
                    item.product_id,
                    item.quantity,
                    item.price,
                    item.quantity * item.price
                ]);

                // Insert order items
                db_connection.query(orderItemsQuery, [orderItemsValues], (err) => {
                    if (err) {
                        return db_connection.rollback(() => {
                            sendErrorResponse(res, 500, "Error creating order items");
                        });
                    }

                    // Commit transaction
                    db_connection.commit((err) => {
                        if (err) {
                            return db_connection.rollback(() => {
                                sendErrorResponse(res, 500, "Error committing transaction");
                            });
                        }
                        sendSuccessResponse(res, { 
                            order_id,
                            message: "Order created successfully" 
                        });
                    });
                });
            });
        });
    });
} catch (error) {
    console.error("Server error:", error);
    sendErrorResponse(res, 500, "Server error");
}
}

function sendSuccessResponse(res, data = {}) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ 
        success: true, 
        message: data.message || "Order processed successfully",
        order_id: data.order_id
    }));
}

function sendErrorResponse(res, statusCode = 500, message = "Error occurred") {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message }));
}

module.exports = {
    handleGiftOrder
};