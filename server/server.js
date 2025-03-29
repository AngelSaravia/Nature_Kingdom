require("dotenv").config();
const http = require("http");
const url = require("url");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const handleSignUp = require("./helpers/sign_up_helper");
const handleLogin = require("./helpers/login_helper");
const db_connection = require("./database"); // Import the database connection
const handleEmployeeLogin = require("./helpers/employee_login");
const { handleQueryReport } = require("./helpers/queryReportHelper");
const ticketHelper = require('./helpers/ticket_helper');
const getParseData = require('./utils/getParseData');
const membershipHelper = require('./helpers/membership_helper');
const handleEnclosureForm = require("./helpers/enclosureFormHelper");
const handleAnimalForm = require("./helpers/animalFormHelper");
const handleEmployeeForm = require("./helpers/employeeFormHelper");
const handleEventForm = require("./helpers/eventFormHelper");
const handleCalendar = require('./helpers/calendar_helper');

console.log("SECRET_KEY:", process.env.SECRET_KEY);

const server = http.createServer(async (req, res) => {
  // Enable CORS
  const allowedOrigins = ["http://localhost:5173", "https://zealous-tree-05afccc10.6.azurestaticapps.net/"];
  if(allowedOrigins.includes(req.headers.origin)){
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
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
  } else if (path === "/calendar" && req.method === "GET") {
    handleCalendar(req, res);
  } else if (path === "/employee_login" && req.method === "POST") {
    handleEmployeeLogin(req, res);
  } else if (path === "/query_report/animals" && req.method === "POST") { //Handle query reports
    handleQueryReport(req, res);
  } else if (path === "/query_report/events" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/employees" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/enclosures" && req.method === "POST") {
    handleQueryReport(req, res);

  } else if (path === "/enclosure_form" && req.method === "POST") {
    handleEnclosureForm(req, res);
  } else if (path === "/get_enclosures" && req.method === "GET") {
    const sql = "SELECT * FROM enclosures"; // Query to fetch all enclosures
    db_connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching enclosures:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results }));
    });


  } else if (path === "/animal_form" && req.method === "POST") {
    handleAnimalForm(req, res);
  } else if (path === "/get_animals" && req.method === "GET") {
    const sql = "SELECT * FROM animals"; // Query to fetch all animals
    db_connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching animals:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results }));
    });


  } else if (path === "/employee_form" && req.method === "POST") {
    handleEmployeeForm(req, res);
  } else if (path === "/get_employees" && req.method === "GET") {
    const sql = "SELECT * FROM employees";
    db_connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching employees:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results }));
    });


  } else if (path === "/event_form" && req.method === "POST") {
    handleEventForm(req, res);
  } else if (path === "/get_events" && req.method === "GET") {
    const sql = "SELECT * FROM events"; // Query to fetch all events
    db_connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching events:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: results }));
    });
  }
  // Add new ticket purchase route
  else if (path === "/api/tickets/purchase" && req.method === "POST") {
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
  else if (path.startsWith("/api/tickets/user/") && req.method === "GET") {
    try {
      const username = path.split("/").pop();
      const result = await ticketHelper.getUserActiveTickets(username);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: error.message
      }));
    }
  }
  else if (path === "/api/membership/check" && req.method === "GET") {
    try {
      const username = url.parse(req.url, true).query.username;
      const result = await membershipHelper.checkExistingMembership(username);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        hasMembership: result
      }));
    } catch (error) {
      console.error('Error checking membership:', error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: error.message || 'Error checking membership status'
      }));
    }
  }
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