const db_connection = require('../database');

function restockProduct(req, res) {
    let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
    // console.log("body", body);
  });

  req.on("end", () => {
    try {
      const { product_id, newStock } = JSON.parse(body);
      // console.log("Received restock request:", { product_id, newStock });

      const query = `
        UPDATE products 
        SET amount_stock = ? 
        WHERE product_id = ?
      `;

      db_connection.query(query, [newStock, product_id], (err, result) => {
        if (err) {
          console.error("Error updating stock:", err);
          return sendErrorResponse(res, 500, "Database error");
        }

        if (result.affectedRows === 0) {
          return sendErrorResponse(res, 404, "Product not found");
        }

        sendSuccessResponse(res, {
          message: "Stock updated successfully",
          product_id,
        });
      });
    } catch (error) {
      console.error("Parsing error:", error);
      sendErrorResponse(res, 400, "Invalid JSON");
    }
  });
}

function sendSuccessResponse(res, data) { 
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, ...data }));
}

function sendErrorResponse(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, message }));
}

module.exports = { restockProduct };