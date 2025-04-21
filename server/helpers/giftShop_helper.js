const db_connection = require("../database");
const url = require("url");

function handleGiftShop(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const { category, name } = parsedUrl.query;

    let query = `
        SELECT 
          product_id, 
          shop_id, 
          name, 
          price, 
          amount_stock, 
          category,
          buy_limit
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
      query += " WHERE is_discontinued = FALSE AND " + conditions.join(" AND ");
    } else {
      query += "WHERE is_discontinued = FALSE ";
    }

    query += " ORDER BY product_id ASC";

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
        return sendSuccessResponse(res, {
          products: [],
          message: "No products found",
        });
      }
      // console.log("Query results:", results);
      sendSuccessResponse(res, { products: results });
    });
  } catch (error) {
    console.error("Server error:", error);
    sendErrorResponse(res, 500, "Server error");
  }
}

function addProduct(req, res, body) {
  const { shop_id, name, price, amount_stock, buy_limit, category } = body;
  // console.log("Received body:", body);

  const query = `
        INSERT INTO products (shop_id, name, price, amount_stock, buy_limit, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  // console.log("Query:", query);
  db_connection.query(
    query,
    [shop_id, name, price, amount_stock, buy_limit, category],
    (err, result) => {
      // console.log("Result:", result);
      if (err) {
        console.error("Insert error:", err);
        return sendErrorResponse(res, 500, "Failed to add product");
      }

      sendSuccessResponse(res, {
        message: "Product added",
        product_id: result.insertId,
      });
    }
  );
}

function updateProduct(req, res, body) {
  const { product_id, name, price, amount_stock, buy_limit, category } = body;

  console.log("Updating product:", body);

  // Build the SQL query dynamically to update only provided fields
  let updateFields = [];
  let values = [];

  if (name !== undefined) {
    updateFields.push("name = ?");
    values.push(name);
  }
  if (price !== undefined) {
    updateFields.push("price = ?");
    values.push(price);
  }
  if (amount_stock !== undefined) {
    updateFields.push("amount_stock = ?");
    values.push(amount_stock);
  }
  if (buy_limit !== undefined) {
    updateFields.push("buy_limit = ?");
    values.push(buy_limit);
  }
  if (category !== undefined) {
    updateFields.push("category = ?");
    values.push(category);
  }

  // Add product_id to values array (for WHERE clause)
  values.push(product_id);

  // If no fields to update, return early
  if (updateFields.length === 0) {
    return sendErrorResponse(res, 400, "No fields to update");
  }

  const query = `
        UPDATE products 
        SET ${updateFields.join(", ")}
        WHERE product_id = ?
    `;

  console.log("Update query:", query, "Values:", values);

  db_connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return sendErrorResponse(res, 500, "Failed to update product");
    }

    if (result.affectedRows === 0) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    sendSuccessResponse(res, { message: "Product updated successfully" });
  });
}

function deleteProduct(req, res, productId) {
  console.log("productid: ", productId);
  const query = `UPDATE products SET is_discontinued = TRUE WHERE product_id = ?`;

  db_connection.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return sendErrorResponse(res, 500, "Failed to delete product");
    }

    sendSuccessResponse(res, { message: "Product deleted" });
  });
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

module.exports = { handleGiftShop, addProduct, deleteProduct, updateProduct };
