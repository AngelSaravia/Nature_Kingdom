require("dotenv").config();
const bcrypt = require("bcrypt");
const getParseData = require("../utils/getParseData");
const db_connection = require("../database");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const handleEmployeeLogin = (req, res) => {
  getParseData(req)
    .then((data) => {
      console.log("Received data:", data);
      let { email, password } = data;

      email = email.trim();
      password = password.trim();

      console.log("Trimmed data:", { email, password });

      if (!email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Username and password are required" })
        );
      }

      db_connection.execute(
        "SELECT * FROM employees WHERE email = ?",
        [email],
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

          const passwordMatch = password === user.password; //need to use bycrpt later
          if (!passwordMatch) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid credentials" }));
          }

          const token = jwt.sign({ email: user.email }, SECRET_KEY, {
            expiresIn: "1h",
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ token }));
        }
      );
    })
    .catch((error) => {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid data" }));
    });
};

module.exports = handleEmployeeLogin;
