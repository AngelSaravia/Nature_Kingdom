require("dotenv").config();
const bcrypt = require("bcrypt");
const getParseData = require("../utils/getParseData");
const db_connection = require("../database");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const checkExistingVisitor = async (username) => {
  console.log("Checking visitor for username:", username);
  const query = `
    SELECT * FROM visitors WHERE username = ?`;

  try {
    const [visitor] = await db_connection.promise().query(query, [username]);

    if (visitor.length === 0) {
      console.log("No visitor found with username:", username);
      return null; // Or return a message to indicate no visitor found
    }

    console.log("visitor check result:", visitor);
    return visitor[0];
  } catch (error) {
    console.error("Error checking visitor status:", error);
    throw error;
  }
};

const handleLogin = (req, res) => {
  getParseData(req)
    .then((data) => {
      console.log("Received data:", data);
      let { username, password } = data;

      username = username.trim();
      password = password.trim();

      console.log("Trimmed data:", { username, password });

      if (!username || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Username and password are required" })
        );
      }

      db_connection.execute(
        "SELECT * FROM visitors WHERE username = ?",
        [username],
        async (err, results) => {
          if (err) {
            console.error("Database error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Internal Server Error" }));
          }

          if (results.length === 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid credentials" }));
          }

          const user = results[0];

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid credentials" }));
          }

          // Include user ID, email, and role in the token payload
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              email: user.email,
            },
            SECRET_KEY,
            { expiresIn: "1h" }
          );

          // Now include email in the response for the frontend
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              token,
              username: user.username,
              email: user.email,
              // Include any other user info you need, but don't include password
            })
          );
        }
      );
    })
    .catch((error) => {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid data" }));
    });
};

module.exports = {
  handleLogin,
  checkExistingVisitor,
};
