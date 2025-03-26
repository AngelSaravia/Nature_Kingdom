require("dotenv").config();
const http = require("http");
const url = require("url");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const handleSignUp = require("./helpers/sign_up_helper");
const handleLogin = require("./helpers/login_helper");
/*new change: added db_connection line*/
const db_connection = require("./database"); // Import the database connection
const handleEmployeeLogin = require("./helpers/employee_login");
const ticketHelper = require('./helpers/ticket_helper');
const getParseData = require('./utils/getParseData');
const membershipHelper = require('./helpers/membership_helper');

console.log("SECRET_KEY:", process.env.SECRET_KEY);

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5177");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running!");
  } else if (path === "/signup" && req.method === "POST") {
    handleSignUp(req, res);
  } else if (path === "/login" && req.method === "POST") {
    handleLogin(req, res);
  } 
  
  // New route to fetch events NEW ADDTION
  else if (path === "/calendar" && req.method === "GET") {
    try {
      const query = "SELECT * FROM events";
      db_connection.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching events:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "Database error" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, events: results }));
      });
    } catch (error) {
      console.error("Error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Server error" }));
    }
  }
  //REMOVE IF THIS SHIT DON WORK ^^

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "Route not found",
      })
    );
  }
  
});

const PORT = 5004;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});