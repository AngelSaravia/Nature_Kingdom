const mysql = require("mysql2");

const db_connection = mysql.createConnection({
  host: "zoombase-t15.mysql.database.azure.com",
  user: "babdi", //"livesite",
  password: "temp", //"livesite123",
  database: "zoo",
});

db_connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database ✅");
});

module.exports = db_connection;
