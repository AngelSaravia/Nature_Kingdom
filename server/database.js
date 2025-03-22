const mysql = require("mysql2");

const db_connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root231",
  database: "nature_kingdom",
});

db_connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database ✅");
});

module.exports = db_connection;
