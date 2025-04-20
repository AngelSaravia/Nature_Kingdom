const db_connection = require("../database");

async function getGiftShopSummary(req, res) {
    const filters = req.query;
    console.log("Giftshop Filters:", filters);

    try {
        let whereClauses = [];
        let queryParams = [];

        // Apply filters for orders (general summary)
        if (filters.startDate) {
            whereClauses.push("o.order_date >= ?");
            queryParams.push(filters.startDate);
        }
        if (filters.endDate) {
            whereClauses.push("o.order_date <= ?");
            queryParams.push(filters.endDate);
        }
        if (filters.minTotal) {
            whereClauses.push("o.total_amount >= ?");
            queryParams.push(filters.minTotal);
        }
        if (filters.maxTotal) {
            whereClauses.push("o.total_amount <= ?");
            queryParams.push(filters.maxTotal);
        }

        const productFilter = filters.products ? JSON.parse(filters.products) : null;
        const whereClauseForOrders = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

        // Queries without product filters
        const [
            [statsResult],
            [bestGrossing],
            [worstGrossing],
            [highestQty],
            [lowestQty],
            ordersTable
        ] = await Promise.all([
            db_connection.promise().query(`
                SELECT COUNT(DISTINCT o.order_id) AS total_orders,
                       COALESCE(SUM(oi.quantity), 0) AS total_products_sold,
                       COALESCE(SUM(o.total_amount), 0) AS total_revenue
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.order_id
                ${whereClauseForOrders}
            `, queryParams),

            db_connection.promise().query(`
                SELECT p.name, SUM(oi.total_amount) AS revenue
                FROM order_items oi
                LEFT JOIN orders o ON o.order_id = oi.order_id
                LEFT JOIN products p ON p.product_id = oi.product_id
                ${whereClauseForOrders}
                GROUP BY p.name
                ORDER BY revenue DESC
                LIMIT 1
            `, queryParams),

            db_connection.promise().query(`
                SELECT p.name, SUM(oi.total_amount) AS revenue
                FROM order_items oi
                LEFT JOIN orders o ON o.order_id = oi.order_id
                LEFT JOIN products p ON p.product_id = oi.product_id
                ${whereClauseForOrders}
                GROUP BY p.name
                ORDER BY revenue ASC
                LIMIT 1
            `, queryParams),

            db_connection.promise().query(`
                SELECT p.name, SUM(oi.quantity) AS qty
                FROM order_items oi
                LEFT JOIN orders o ON o.order_id = oi.order_id
                LEFT JOIN products p ON p.product_id = oi.product_id
                ${whereClauseForOrders}
                GROUP BY p.name
                ORDER BY qty DESC
                LIMIT 1
            `, queryParams),

            db_connection.promise().query(`
                SELECT p.name, SUM(oi.quantity) AS qty
                FROM order_items oi
                LEFT JOIN orders o ON o.order_id = oi.order_id
                LEFT JOIN products p ON p.product_id = oi.product_id
                ${whereClauseForOrders}
                GROUP BY p.name
                ORDER BY qty ASC
                LIMIT 1
            `, queryParams),

            db_connection.promise().query(`
                SELECT o.order_id, o.visitor_id, o.order_date, o.total_amount, SUM(oi.quantity) AS total_items
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.order_id
                ${whereClauseForOrders}
                GROUP BY o.order_id
                ORDER BY o.order_date DESC
            `, queryParams)
        ]);

        // Query for order items with proper handling of product + order filters
        let orderItemsTable = [];
        let orderItemsWhere = [];
        let orderItemsParams = [];

        if (productFilter && productFilter.length > 0) {
            orderItemsWhere.push(`oi.product_id IN (${productFilter.map(() => '?').join(', ')})`);
            orderItemsParams.push(...productFilter);
        }
        if (filters.startDate) {
            orderItemsWhere.push("o.order_date >= ?");
            orderItemsParams.push(filters.startDate);
        }
        if (filters.endDate) {
            orderItemsWhere.push("o.order_date <= ?");
            orderItemsParams.push(filters.endDate);
        }
        // NOTE: We no longer include minTotal and maxTotal here for orderItemsTable

        const orderItemsWhereClause = orderItemsWhere.length > 0 ? "WHERE " + orderItemsWhere.join(" AND ") : "";

        const [orderItems] = await db_connection.promise().query(`
            SELECT oi.order_id, p.product_id, p.name AS product_name, oi.quantity, oi.price, oi.total_amount, o.order_date
            FROM order_items oi
            LEFT JOIN orders o ON o.order_id = oi.order_id
            LEFT JOIN products p ON p.product_id = oi.product_id
            ${orderItemsWhereClause}
            ORDER BY o.order_date DESC
        `, orderItemsParams);

        orderItemsTable = orderItems;

        const response = {
            summary: {
                totalOrders: statsResult.total_orders,
                totalProductsSold: statsResult.total_products_sold,
                totalRevenue: statsResult.total_revenue,
                bestGrossingItem: bestGrossing[0]?.name || null,
                worstGrossingItem: worstGrossing[0]?.name || null,
                highestQuantityItem: highestQty[0]?.name || null,
                lowestQuantityItem: lowestQty[0]?.name || null
            },
            ordersTable,
            orderItemsTable
        };

        sendSuccessResponse(res, response);

    } catch (error) {
        console.error("Error fetching giftshop report:", error);
        sendErrorResponse(res, 500, "Server error");
    }
}

function sendSuccessResponse(res, data = {}) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, ...data }));
}

function sendErrorResponse(res, statusCode = 500, message = "Error occurred") {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message }));
}

module.exports = { getGiftShopSummary };
