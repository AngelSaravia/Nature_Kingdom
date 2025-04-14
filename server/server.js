require("dotenv").config();
const http = require("http");
const url = require("url");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const handleSignUp = require("./helpers/sign_up_helper");
const handleLogin = require("./helpers/login_helper");
const db_connection = require("./database");
const handleEmployeeLogin = require("./helpers/employee_login");
const {
  handleQueryReport,
  handleDistinctValuesForMedicalRecords,
} = require("./helpers/queryReportHelper");
const ticketHelper = require("./helpers/ticket_helper");
const getParseData = require("./utils/getParseData");
const membershipHelper = require("./helpers/membership_helper");
const handleEnclosureForm = require("./helpers/enclosureFormHelper");
const handleAnimalForm = require("./helpers/animalFormHelper");
const handleEmployeeForm = require("./helpers/employeeFormHelper");
const handleEventForm = require("./helpers/eventFormHelper");
const handleTicketForm = require("./helpers/ticketFormHelper");
const handleVisitorForm = require("./helpers/visitorFormHelper");
const handleMembershipForm = require("./helpers/membershipFormHelper");
const handleMedicalForm = require("./helpers/medicalFormHelper");
const handleCalendar = require("./helpers/calendar_helper");
const handleGiftShop = require("./helpers/giftShop_helper");
const handleGiftOrder = require("./helpers/order_helper");
const handleAnimalsByEnclosure = require("./helpers/handleanimalEnclosures");
const {
  getEnclosuresByUserManagerQuery,
} = require("./helpers/enclosuresByManagerQuery");
const { updateAnimalHealth } = require("./helpers/modifytheAniStatus");
const handleFeedForm = require("./helpers/feedFormHelper");
const giftshopHelper = require("./helpers/giftshopPurchasesHelper");
const handleGiftShopHistory = require("./helpers/giftshopHistoryHelper");
const handleGiftShopRestock = require("./helpers/giftshopRestockHelper");
const getClockInStatus = require("./helpers/ClockInHelper");
const getEmployeeTimesheets = require("./helpers/timeSheetsHelper");
const alertsHelper = require("./helpers/vetNotificationHelper");
const managerAlertsHelper = require("./helpers/managerNotificationHelper");

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
  req.query = parsedUrl.query;
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
  } else if (path === "/api/giftshop/history" && req.method === "GET") {
    handleGiftShopHistory(req, res);
  } else if (path === "/api/restock" && req.method === "POST") {
    handleGiftShopRestock.restockProduct(req, res);
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
  } else if (
    path === "/api/veterinarian/resolve-alert" &&
    req.method === "POST"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { alertId } = JSON.parse(body);

        if (!alertId) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Alert ID is required" })
          );
          return;
        }

        alertsHelper
          .resolveAlert(alertId)
          .then(() => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          })
          .catch((error) => {
            console.error("Error resolving alert:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: error.message || "Failed to resolve alert",
              })
            );
          });
      } catch (error) {
        console.error("Error parsing resolve alert request:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server error" }));
      }
    });
  }
  // Veterinarian alerts endpoint (fixed to remove duplicate)
  else if (path === "/api/veterinarian/alerts" && req.method === "GET") {
    try {
      const managerId = req.query.managerId;

      if (!managerId) {
        console.log("DEBUG: Missing managerId parameter");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Manager ID is required" })
        );
        return;
      }

      // Check if managerId is numeric
      if (isNaN(parseInt(managerId, 10))) {
        console.log("DEBUG: managerId is not a valid number");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Manager ID must be a valid number",
          })
        );
        return;
      }

      alertsHelper
        .getVeterinarianAlerts(managerId)
        .then((alerts) => {
          console.log(
            "DEBUG: Successfully fetched alerts, count:",
            alerts.length
          );
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, data: alerts }));
        })
        .catch((error) => {
          console.error("Error getting veterinarian alerts:", error);
          console.error("Error stack:", error.stack);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Failed to fetch alerts",
              error: error.message,
            })
          );
        });
    } catch (error) {
      console.error("Error in veterinarian alerts endpoint:", error);
      console.error("Error stack:", error.stack);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Server error",
          error: error.message,
        })
      );
    }
  }
  // Manager alerts endpoint
  else if (path === "/api/manager/alerts" && req.method === "GET") {
    try {
      console.log("DEBUG: Received request to /api/manager/alerts");
      console.log("DEBUG: Full query parameters:", req.query);

      const employeeId = req.query.employeeId;
      console.log("DEBUG: Extracted employeeId:", employeeId);
      console.log("DEBUG: Type of employeeId:", typeof employeeId);

      if (!employeeId) {
        console.log("DEBUG: Missing employeeId parameter");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, message: "Employee ID is required" })
        );
        return;
      }

      // Check if employeeId is numeric
      if (isNaN(parseInt(employeeId, 10))) {
        console.log("DEBUG: employeeId is not a valid number");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Employee ID must be a valid number",
          })
        );
        return;
      }

      console.log("DEBUG: About to call managerAlertsHelper.getManagerAlerts");
      managerAlertsHelper
        .getManagerAlerts(employeeId)
        .then((alerts) => {
          console.log(
            "DEBUG: Successfully fetched alerts, count:",
            alerts.length
          );
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, data: alerts }));
        })
        .catch((error) => {
          console.error("Error getting manager alerts:", error);
          console.error("Error stack:", error.stack);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Failed to fetch alerts",
              error: error.message,
            })
          );
        });
    } catch (error) {
      console.error("Error in manager alerts endpoint:", error);
      console.error("Error stack:", error.stack);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Server error",
          error: error.message,
        })
      );
    }
  }
  // Manager resolve alert endpoint
  else if (path === "/api/manager/resolve-alert" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { alertId } = JSON.parse(body);

        if (!alertId) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, message: "Alert ID is required" })
          );
          return;
        }

        managerAlertsHelper
          .resolveAlert(alertId)
          .then(() => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          })
          .catch((error) => {
            console.error("Error resolving alert:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: error.message || "Failed to resolve alert",
              })
            );
          });
      } catch (error) {
        console.error("Error parsing resolve alert request:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server error" }));
      }
    });
  } else if (path === "/query_report/enclosures" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/tickets" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/revenue" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/feedLogs" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/medicalRecords" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (
    path === "/medical_records/distinct_values" &&
    req.method === "GET"
  ) {
    //for medical Qreport dropdowns
    handleDistinctValuesForMedicalRecords(req, res);
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
        console.error("Error fetching tickets:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: results }));
    });
  } else if (path === "/api/animals/critical-stats" && req.method === "GET") {
    console.log("Received request for /api/animals/critical-stats");

    // Using callback style with db_connection instead of pool with async/await
    db_connection.query(
      "SELECT COUNT(*) as total FROM animals WHERE health_status = ?",
      ["CRITICAL"],
      (error, results) => {
        if (error) {
          console.error("Database query error details:", {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState,
            sql: error.sql,
          });
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Database query failed" }));
          return;
        }

        const criticalStats = {
          total: results[0].total,
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(criticalStats));
      }
    );
  } else if (path === "/visitor_form" && req.method === "POST") {
    handleVisitorForm(req, res);
  } else if (path === "/get_visitors" && req.method === "GET") {
    const sql = "SELECT * FROM visitors"; // Query to fetch all visitors
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching visitors:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: results }));
    });
  } else if (path === "/feedLog_form" && req.method === "POST") {
    handleFeedForm(req, res);
  } else if (path === "/get_feedLogs" && req.method === "GET") {
    const sql = "SELECT * FROM feed_schedules"; // Query to fetch all feed logs
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching feed logs:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: results }));
    });
  } else if (path === "/medical_form" && req.method === "POST") {
    handleMedicalForm(req, res);
  } else if (path === "/get_medical_records" && req.method === "GET") {
    const sql = "SELECT * FROM medical_records";
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching medical records:", err);
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
        console.error("Error fetching memberships:", err);
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
  } else if (path === "/api/clock_in" && req.method === "GET") {
    console.log("Received clock in request");
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const email = urlParams.searchParams.get("email");
    console.log("email", email);

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "email is required" }));
    } else {
      getClockInStatus.getClockInStatus(email, res);
    }
  } else if (path === "/api/set_clock_in" && req.method === "GET") {
    console.log("Received set clock-in request");
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const email = urlParams.searchParams.get("email");
    // console.log("email", email);

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "email is required" }));
    } else {
      getClockInStatus.setClockInStatus(email, false, res);
    }
  } else if (path === "/api/set_clock_out" && req.method === "GET") {
    console.log("Received set clock-out request");
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const email = urlParams.searchParams.get("email");
    // console.log("email", email);

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "email is required" }));
    } else {
      getClockInStatus.setClockOutStatus(email, true, res);
    }
  } else if (path === "/api/employee_timesheets" && req.method === "GET") {
    console.log("Received employee timesheets request");
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const email = urlParams.searchParams.get("email");

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "email is required" }));
    } else {
      getEmployeeTimesheets.getEmployeeTimesheets(email, res);
    }
  } else if (path === "/api/giftshop/purchases" && req.method === "GET") {
    const username = url.parse(req.url, true).query.username;

    if (!username) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ success: false, message: "Username is required" })
      );
      return;
    }

    try {
      // Rerouting to the helper function that fetches gift shop purchases
      const purchases = await giftshopHelper.getUserGiftShopPurchases(username);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: purchases }));
    } catch (error) {
      console.error("Error fetching gift shop purchases:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to fetch gift shop purchases",
        })
      );
    }
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
