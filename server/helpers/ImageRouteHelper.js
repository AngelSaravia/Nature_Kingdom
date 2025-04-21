// imageRouteHelper.js
const fs = require("fs");
const path = require("path");

// Serve uploaded files
function serveUploadedFile(req, res) {
  const requestPath = req.url;
  const filePath = path.join(process.cwd(), requestPath);

  // Validate path - prevent directory traversal attacks
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(path.join(process.cwd(), "uploads"))) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("File not found");
      }
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("Internal server error");
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

// Helper to get MIME type based on file extension
function getContentType(ext) {
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

module.exports = serveUploadedFile;
