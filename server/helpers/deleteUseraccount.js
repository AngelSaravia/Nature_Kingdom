const db_connection = require("../database");
const bcrypt = require("bcryptjs");
const getParseData = require("../utils/getParseData");

/**
 * Handles the account deletion process
 */
function handleDeleteAccount(req, res) {
  if (req.method !== "DELETE") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "Method not allowed. Use DELETE",
      })
    );
    return;
  }

  getParseData(req)
    .then(async (data) => {
      console.log("Received data for account deletion:", data);
      const { visitor_id, current_password, confirmation_text } = data;

      // Validate required fields
      if (!visitor_id || !current_password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message:
              "Missing required fields: visitor_id and current_password are required",
          })
        );
        return;
      }

      // Verify the confirmation text if required
      if (!confirmation_text || confirmation_text !== "Delete account") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "You must type 'Delete account' to confirm deletion",
          })
        );
        return;
      }

      // First verify the password is correct
      const verifyPasswordSQL = "SELECT * FROM visitors WHERE visitor_id = ?";

      try {
        const [results] = await db_connection
          .promise()
          .query(verifyPasswordSQL, [visitor_id]);

        if (results.length === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "User not found",
            })
          );
          return;
        }

        const user = results[0];

        // Verify password using bcrypt
        const passwordMatch = await bcrypt.compare(
          current_password,
          user.password
        );
        if (!passwordMatch) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Incorrect password",
            })
          );
          return;
        }

        // Password is correct, proceed with account deletion using transaction
        const connection = db_connection.promise();
        await connection.beginTransaction();

        try {
          // Define queries to delete from related tables first
          const deleteRelatedSQL = [
            "DELETE FROM memberships WHERE visitor_id = ?",
            "DELETE FROM tickets WHERE visitor_id = ?",
            "DELETE FROM orders WHERE visitor_id = ?",
            // Add other related tables as needed
          ];

          // Execute all related table deletions
          for (const sql of deleteRelatedSQL) {
            await connection.query(sql, [visitor_id]);
          }

          // Finally delete the visitor
          const deleteVisitorSQL = "DELETE FROM visitors WHERE visitor_id = ?";
          await connection.query(deleteVisitorSQL, [visitor_id]);

          // Commit the transaction
          await connection.commit();

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "Account successfully deleted",
            })
          );
        } catch (error) {
          // If an error occurs, roll back the transaction
          await connection.rollback();
          console.error("Error during account deletion:", error);

          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Error deleting account",
            })
          );
        }
      } catch (error) {
        console.error("Database error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Internal server error",
          })
        );
      }
    })
    .catch((error) => {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid data format",
          success: false,
        })
      );
    });
}

module.exports = {
  handleDeleteAccount,
};
