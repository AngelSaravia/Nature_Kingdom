require("dotenv").config();
const getParseData = require("../utils/getParseData");
const db_connection = require("../database");
const bcrypt = require("bcryptjs"); // Import bcrypt for password validation and hashing

const handleUpdateProfile = (req, res) => {
  getParseData(req)
    .then((data) => {
      const {
        visitor_id,
        first_name,
        last_name,
        email,
        phone_number,
        street_address,
        city,
        state,
        zipcode,
        country,
        gender,
        current_password,
        new_password,
        show_password_fields,
      } = data;

      // First, verify the current password
      const verifyQuery = "SELECT password FROM visitors WHERE visitor_id = ?";

      db_connection.query(verifyQuery, [visitor_id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Server error occurred" })
          );
          return;
        }

        if (results.length === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "User not found" })
          );
          return;
        }

        const storedPasswordHash = results[0].password;

        // Verify the current password
        bcrypt.compare(current_password, storedPasswordHash, (err, isMatch) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: "Password verification failed",
              })
            );
            return;
          }

          if (!isMatch) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: "Current password is incorrect",
              })
            );
            return;
          }

          // Password verified, proceed with update
          if (show_password_fields && new_password) {
            // Hash the new password and update user data
            bcrypt.hash(new_password, 10, (err, hashedPassword) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    message: "Error hashing password",
                  })
                );
                return;
              }

              const updateQuery = `
                UPDATE visitors 
                SET first_name = ?, 
                    last_name = ?, 
                    email = ?, 
                    phone_number = ?,
                    street_address = ?,
                    city = ?,
                    state = ?,
                    zipcode = ?,
                    country = ?,
                    gender = ?,
                    password = ?
                WHERE visitor_id = ?
              `;

              db_connection.query(
                updateQuery,
                [
                  first_name,
                  last_name,
                  email,
                  phone_number,
                  street_address,
                  city,
                  state,
                  zipcode,
                  country,
                  gender,
                  hashedPassword,
                  visitor_id,
                ],
                (err, result) => {
                  if (err) {
                    console.error("Error updating user data:", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({
                        success: false,
                        message: "Error updating profile",
                      })
                    );
                    return;
                  }

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: true,
                      message: "Profile updated successfully",
                      user: {
                        first_name,
                        last_name,
                        email,
                        phone_number,
                      },
                    })
                  );
                }
              );
            });
          } else {
            // Update user data without changing password
            const updateQuery = `
              UPDATE visitors 
              SET first_name = ?, 
                  last_name = ?, 
                  email = ?, 
                  phone_number = ?,
                  street_address = ?,
                  city = ?,
                  state = ?,
                  zipcode = ?,
                  country = ?,
                  gender = ?
              WHERE visitor_id = ?
            `;

            db_connection.query(
              updateQuery,
              [
                first_name,
                last_name,
                email,
                phone_number,
                street_address,
                city,
                state,
                zipcode,
                country,
                gender,
                visitor_id,
              ],
              (err, result) => {
                if (err) {
                  console.error("Error updating user data:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: "Error updating profile",
                    })
                  );
                  return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: "Profile updated successfully",
                    user: {
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      street_address,
                      city,
                      state,
                      zipcode,
                      country,
                      gender,
                    },
                  })
                );
              }
            );
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "Invalid request format" })
      );
    });
};

module.exports = handleUpdateProfile;
