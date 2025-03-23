require("dotenv").config();
const http = require("http");
const url = require("url");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const handleSignUp = require("./helpers/sign_up_helper");
const handleLogin = require("./helpers/login_helper");
const handleEmployeeLogin = require("./helpers/employee_login");
const ticketHelper = require('./helpers/ticket_helper');
const getParseData = require('./utils/getParseData');
const membershipHelper = require('./helpers/membership_helper');

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
    "Content-Type, X-Requested-With"
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
  }
  // Handle signup route
  else if (path === "/signup" && req.method === "POST") {
    handleSignUp(req, res);
  } else if (path === "/login" && req.method === "POST") {
    handleLogin(req, res);
  } else if (path === "/employee_login" && req.method === "POST") {
    handleEmployeeLogin(req, res);
  } 
  // Add new ticket purchase route
  else if (path === "/api/tickets/purchase" && req.method === "POST") {
    try {
      const data = await getParseData(req);
      const result = await ticketHelper.processTicketPurchase(data);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: error.message || 'Error processing ticket purchase'
      }));
    }
  }
  else if (path === "/api/membership/purchase" && req.method === "POST") {
    try {
      const data = await getParseData(req);
      const result = await membershipHelper.processMembershipPurchase(data);
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: error.message || 'Error processing membership purchase'
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