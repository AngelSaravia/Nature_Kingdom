const http = require("http");
const url = require("url");
const handleSignUp = require("./helpers/sign_up"); // Import your signup handler

<<<<<<< HEAD
const db_connection = mysql.createConnection({
  host: "localhost", // or your database host
  user: "root", // your database username
  password: "baharjoon3", // your database password
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
=======
// Create the server
const server = http.createServer(async (req, res) => {
  // Enable CORS
>>>>>>> origin/main
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Handle root route
  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running!");
  }
  // Handle signup route
  else if (path === "/signup" && req.method === "POST") {
    // Use the handleSignUp function instead of the inline code
    handleSignUp(req, res);
  }
  // Handle 404 Not Found
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
