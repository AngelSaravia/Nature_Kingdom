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
const { handleQueryReport } = require("./helpers/queryReportHelper");
const ticketHelper = require('./helpers/ticket_helper');
const getParseData = require('./utils/getParseData');
const membershipHelper = require('./helpers/membership_helper');
const handleCalendar = require('./helpers/calendar_helper');

console.log("SECRET_KEY:", process.env.SECRET_KEY);

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
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
    handleCalendar(req, res);
  } else if (path === "/employee_login" && req.method === "POST") {
    handleEmployeeLogin(req, res);
  } else if (path === "/query_report/animals" && req.method === "POST") { //Handle query reports
    handleQueryReport(req, res);
  } else if (path === "/query_report/events" && req.method === "POST") {
    handleQueryReport(req, res);
  } else if (path === "/query_report/enclosures" && req.method === "POST") {
    handleQueryReport(req, res);
  }
  // Handle enclosure data entry form submission
  else if (path === "/enclosure_form" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { name, current_capacity, capacity, exhibit_id, temp_control } = formData;
        const Manager_id = formData.Manager_id || null;
        const location = formData.location || null;
        const opens_at = formData.opens_at || null;
        const closes_at = formData.closes_at || null;
        const status = formData.status || null;


        if (!name || !current_capacity || !capacity || !exhibit_id || !temp_control) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
          return;
        }
        const tempControlValue = temp_control ? 1 : 0;
        const sql = "INSERT INTO enclosures (name, current_capacity, capacity, exhibit_id, temp_control, Manager_id, location, opens_at, closes_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [name, current_capacity, capacity, exhibit_id, tempControlValue, Manager_id, location, opens_at, closes_at, status];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Enclosure added successfully", id: result.insertId }));
        });
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
  }
  // Handle animal form submission
  else if (path === "/animal_form" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { animal_name, date_of_birth, enclosure_id, species, animal_type, health_status } = formData;

        if (!animal_name || !date_of_birth || !enclosure_id || !species || !animal_type || !health_status) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
          return;
        }

        const sql = "INSERT INTO animals (animal_name, date_of_birth, enclosure_id, species, animal_type, health_status) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [animal_name, date_of_birth, enclosure_id, species, animal_type, health_status];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Animal added successfully", id: result.insertId }));
        });
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
  }
  // Handle employee form submission
  else if (path === "/employee_form" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { first_name, last_name, date_of_birth, salary, user_name, department_id, role, gender, email, phone} = formData;
        const Manager_id = formData.Manager_id || null;
        const Minit_name = formData.Minit_name || null;
        const street_address = formData.street_address || null;
        const city = formData.city || null;
        const state = formData.state || null;
        const zip_code = formData.zip_code || null;
        const country = formData.country || null;

        if (!first_name || !last_name || !date_of_birth || !salary || !user_name || !department_id || !role || !gender || !email || !phone) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
          return;
        }

        const sql = "INSERT INTO employees (first_name, last_name, date_of_birth, salary, user_name, department_id, role, gender, email, phone, Manager_id, Minit_name, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [first_name, last_name, date_of_birth, salary, user_name, department_id, role, gender, email, phone, Manager_id, Minit_name, street_address, city, state, zip_code, country];

        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Employee added successfully", id: result.insertId }));
        });
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
  }
  //Handle event form submission
  else if (path === "/event_form" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { eventName, eventDate, location, eventType, price } = formData;
        const description = formData.description || null;
        const duration = formData.duration || null;
        const capacity = formData.capacity || null;
        const managerID = formData.managerID || null;

        if (!eventName || !eventDate || !location || !eventType || !price) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
          return;
        }

        const sql = "INSERT INTO events (eventName, eventDate, location, eventType, price, description, duration, capacity, managerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [eventName, eventDate, location, eventType, price, description, duration, capacity, managerID];

        db_connection.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Event added successfully", id: result.insertId }));
        });
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
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