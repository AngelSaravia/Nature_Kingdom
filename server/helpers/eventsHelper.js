const db_connection = require("../database");

module.exports = {
  getUpcomingEvents: (callback) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const sql = `
      SELECT id, name, date, start_time, end_time, description, 
      FROM events 
      WHERE date >= ? 
      ORDER BY date ASC 
      LIMIT 6
    `;

    db_connection.query(sql, [currentDate], (err, results) => {
      if (err) {
        console.error("Error fetching upcoming events:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};
