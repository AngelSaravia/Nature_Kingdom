const http = require("http");
const url = require("url");
const handleSignUp = require("./helpers/sign_up"); // Import your signup handler

// Create the server
const server = http.createServer(async (req, res) => {
  // Enable CORS
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
