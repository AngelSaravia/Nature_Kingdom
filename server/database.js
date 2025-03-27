const mysql = require("mysql2");

const db_connection = mysql.createConnection({
  host: "localhost",//"zoombase-t15.mysql.database.azure.com",
  user: "root",//"livesite",
  password: "baharjoon3",//"livesite123",
  database: "nature_kingdom",//"zoo",
});

db_connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database ✅");
});

module.exports = db_connection;
