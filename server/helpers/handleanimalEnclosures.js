const url = require("url");

module.exports = function handleAnimalsByEnclosure(req, res, db) {
  // Check if the request method is GET
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Method not allowed. Use GET" })
    );
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/");
  const enclosureId = pathParts[3]; // "/animals/enclosure/:id"

  console.log("🐵 req.url:", req.url);

  if (!enclosureId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Enclosure ID is required" })
    );
    return;
  }

  // Use callback style instead of promises
  db.query(
    "SELECT * FROM animals WHERE enclosure_id = ?",
    [enclosureId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching animals by enclosure:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Database error" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, data: rows }));
    }
  );
};
