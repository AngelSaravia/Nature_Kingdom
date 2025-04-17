const db_connection = require("../database");

// Query to retrieve gift shop purchases for a specific user
const getGiftShopPurchasesQuery = `
  SELECT 
    o.order_id, 
    oi.order_item_id, 
    oi.product_id, 
    oi.quantity, 
    oi.total_amount, 
    o.order_date, 
    pr.name AS product_name, 
    pr.price AS product_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products pr ON oi.product_id = pr.product_id
    WHERE o.visitor_id = (
        SELECT visitor_id FROM visitors WHERE username = ?
    )
    ORDER BY o.order_date DESC;
`;

const getUserGiftShopPurchases = async (username) => {
  try {
    console.log('Fetching gift shop purchases for user:', username);
    const [purchases] = await db_connection.promise().query(getGiftShopPurchasesQuery, [username]);
    // console.log('Found purchases:', purchases);

    return {
      success: true,
      purchases: purchases,
      purchaseCount: purchases.length
    };
  } catch (error) {
    console.error('Error fetching user gift shop purchases:', error);
    throw error;
  }
};

module.exports = {
  getUserGiftShopPurchases
};
