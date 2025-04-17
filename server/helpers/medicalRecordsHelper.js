const db_connection = require("../database");
const url = require("url");

/**
 * Handles HTTP requests related to retrieving medical records
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
function handleMedicalRecords(req, res) {
  // Parse the URL to get the pathname and query parameters
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Check if the path matches the pattern for fetching a specific animal's medical records
  const animalRecordsPattern = /^\/medical_records\/animal\/(\d+)$/;
  const animalMatch = pathname.match(animalRecordsPattern);
  
  if (animalMatch && req.method === "GET") {
    // Extract the animal ID from the URL path
    const animalId = animalMatch[1];
    
    // SQL query to get all medical records for the specified animal, ordered by date (most recent first)
    const sql = "SELECT * FROM medical_records WHERE animal_id = ? ORDER BY date DESC";
    
    db_connection.query(sql, [animalId], (err, results) => {
      if (err) {
        console.error("Error fetching animal medical records:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          success: false, 
          message: "Database error while retrieving medical records" 
        }));
        return;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        success: true, 
        data: results 
      }));
    });
  } 
  // Handler for getting all medical records
  else if (pathname === "/get_medical_records" && req.method === "GET") {
    // SQL query to get all medical records, ordered by date (most recent first)
    const sql = "SELECT * FROM medical_records ORDER BY date DESC";
    
    db_connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching all medical records:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          success: false, 
          message: "Database error while retrieving all medical records" 
        }));
        return;
      }
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        success: true, 
        data: results 
      }));
    });
  }
  else {
    // If no patterns match, send a 404 response
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ 
      success: false, 
      message: "Route not found" 
    }));
  }
}

module.exports = handleMedicalRecords;