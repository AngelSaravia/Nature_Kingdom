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
const ticketHelper = require("./helpers/ticket_helper");
const getParseData = require("./utils/getParseData");
const membershipHelper = require("./helpers/membership_helper");
const handleEnclosureForm = require("./helpers/enclosureFormHelper");
const handleAnimalForm = require("./helpers/animalFormHelper");
const handleEmployeeForm = require("./helpers/employeeFormHelper");
const handleEventForm = require("./helpers/eventFormHelper");
const handleCalendar = require("./helpers/calendar_helper");
const handleGiftShop = require("./helpers/giftShop_helper");
const handleGiftOrder = require("./helpers/order_helper");
const handleAnimalsByEnclosure = require("./helpers/handleanimalEnclosures");
const {
  getEnclosuresByUserManagerQuery,
} = require("./helpers/enclosuresByManagerQuery");
const { updateAnimalHealth } = require("./helpers/modifytheAniStatus");

console.log("SECRET_KEY:", process.env.SECRET_KEY);

const server = http.createServer(async (req, res) => {
  // Enable CORS
  const allowedOrigins = [
    "http://localhost:5173",
    "https://black-river-089b82310.6.azurestaticapps.net",
  ];
  if (allowedOrigins.includes(req.headers.origin)) {
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
  console.log("path ", path);

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running!");
  } else if (path === "/signup" && req.method === "POST") {
    handleSignUp(req, res);
  } else if (path === "/login" && req.method === "POST") {
    handleLogin.handleLogin(req, res);
  } else if (path === "/calendar" && req.method === "GET") {
    handleCalendar(req, res);
  } else if (path === "/api/giftshop" && req.method === "GET") {
    handleGiftShop(req, res);
  } else if (path === "/employee_login" && req.method === "POST") {
    handleEmployeeLogin(req, res);

    // Query Reports
  } else if (path === "/query_report/animals" && req.method === "POST") {
    handleQueryReport(req, res);
  } // Added route to fetch all enclosure names for animal query report
  else if (path === "/get_enclosure_names" && req.method === "GET") {
    const sql = "SELECT name FROM enclosures"; // Query to fetch all enclosure names
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching enclosure names:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: true, data: results.map((row) => row.name) })
      ); // Return only the names
    });
  } else if (path === "/query_report/events" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/employees" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/enclosures" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/tickets" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/visitors" && req.method === "POST") {
    handleQueryReport(req, res);
    // Data Entry Forms
  } else if (path.startsWith("/animals/enclosure/") && req.method === "GET") {
    console.log("Animals by enclosure route matched!", path);
    handleAnimalsByEnclosure(req, res, db_connection);
  } else if (path.match(/^\/animals\/(\d+)\/health$/) && req.method === "PUT") {
    const animalId = path.match(/^\/animals\/(\d+)\/health$/)[1];

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const healthStatus = data.healthStatus;
        updateAnimalHealth(animalId, healthStatus);
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (path === "/enclosure_form" && req.method === "POST") {
    handleEnclosureForm(req, res);
  } else if (path === "/get_enclosures" && req.method === "GET") {
    const sql = "SELECT * FROM enclosures";
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
      console.log("Animals from DB:", results); // Check what's actually returned
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: results }));
    });
  } else if (path === "/get_exhibits" && req.method === "GET") {
    const sql = "SELECT * FROM exhibits"; // Query to fetch all exhibits
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching exhibits:", err);
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
  } else if (path === "/ticket_form" && req.method === "POST") {
    handleTicketForm(req, res);
  } else if (path === "/get_tickets" && req.method === "GET") {
    const sql = "SELECT * FROM tickets"; // Query to fetch all tickets
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
  } else if (path === "/visitor_form" && req.method === "POST") {
    handleVisitorForm(req, res);
  } else if (path === "/get_visitors" && req.method === "GET") {
    const sql = "SELECT * FROM visitors"; // Query to fetch all visitors
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
  } else if (path === "/membership_form" && req.method === "POST") {
    handleMembershipForm(req, res);
  } else if (path === "/get_memberships" && req.method === "GET") {
    const sql = "SELECT * FROM memberships"; // Query to fetch all memberships
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
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const ticketData = JSON.parse(body);
        console.log("Received request body:", ticketData);
        const response = await ticketHelper.processTicketPurchase(ticketData);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error("Error processing ticket purchase:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server error" }));
      }
    });
  } else if (path === "/api/membership/purchase" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const membershipData = JSON.parse(body);
        console.log("Received request body:", membershipData);
        const response = await membershipHelper.processMembershipPurchase(
          membershipData
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error("Error processing membership purchase:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server error" }));
      }
    });
  } else if (path.startsWith("/api/tickets/user/") && req.method === "GET") {
    try {
      const username = path.split("/").pop();
      const result = await ticketHelper.getUserActiveTickets(username);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: error.message,
        })
      );
    }
  } else if (path === "/api/membership/check" && req.method === "GET") {
    try {
      const username = url.parse(req.url, true).query.username;
      const result = await membershipHelper.checkExistingMembership(username);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error("Error checking membership:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: error.message || "Error checking membership status",
        })
      );
    }
  } else if (path === "/api/checkvisitor" && req.method === "GET") {
    try {
      const username = url.parse(req.url, true).query.username;
      const result = await handleLogin.checkExistingVisitor(username);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      console.error("Error checking visitor:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: error.message || "Error checking visitor status",
        })
      );
    }
  } else if (path === "/api/giftshop/order" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const orderData = JSON.parse(body);
        console.log("Received gift order data:", orderData);
        await handleGiftOrder.handleGiftOrder(req, res, orderData);
      } catch (error) {
        console.error("Error processing gift order:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server error" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "Route not found",
      })
    );
  }
});
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
