const getParseData = require("../utils/getParseData");
const db_connection = require("../database"); // Import the database connection

const handleSignUp = (req, res) => {
  getParseData(req) // Use getParseData to parse the request body
    .then((data) => {
      const {
        firstname,
        middlename,
        lastname,
        email,
        age,
        state,
        country,
        zipcode,
        address,
        city,
        mobile,
      } = data;

      const query = `
        INSERT INTO users (firstname, middlename, lastname, email, age, state, country, zipcode, address, city, mobile) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db_connection.query(
        query,
        [
          firstname,
          middlename,
          lastname,
          email,
          age,
          state,
          country,
          zipcode,
          address,
          city,
          mobile,
        ],
        (err, result) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error inserting data into the database.");
            return;
          }

          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("User added successfully!");
        }
      );
    })
    .catch((error) => {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid request body.");
    });
};

module.exports = handleSignUp;
