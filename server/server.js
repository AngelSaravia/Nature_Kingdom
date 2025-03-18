const http = require("http");
const mysql = require("mysql2");
const { sign_up } = require("./routes/sign_up");

const db_connection = mysql.createConnection({
  host: "localhost", // or your database host
  user: "root", // your database username
  password: "Root231.", // your database password
  database: "nature_kingdom", // your database name
}); //must change password for each pull

// Check the database connection
db_connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database  ✅");
});

const server = http.createServer((req, res) => {
  // ADD THESE CORS HEADERS RIGHT HERE ↓
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  // END OF CORS HEADERS ↑

  // Handle POST requests for the '/signup' route
  if (req.method === "POST" && req.url === "/signup") {
    sign_up(req, res, db_connection);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

server.listen(5001, () => {
  console.log("Server is running on http://localhost:5001");
});
