require("dotenv").config();
const getParseData = require("../utils/getParseData");
const db_connection = require("../database");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const handleSignUp = (req, res) => {
  getParseData(req) // Use getParseData to parse the request body
    .then((data) => {
      const {
        firstname,
        middlename,
        lastname,
        email,
        username,
        password,
        age,
        state,
        country,
        zipcode,
        address,
        city,
        mobile,
      } = data;

      // Hash the password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error hashing password.");
          return;
        }

        const query = `
          INSERT INTO users (firstname, middlename, lastname, email, username, password, age, state, country, zipcode, address, city, mobile) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db_connection.query(
          query,
          [
            firstname,
            middlename,
            lastname,
            email,
            username,
            hashedPassword, // Use hashed password instead of plain text
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
              console.error("Error inserting data into the database:", err); // Log error for debugging
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Error inserting data into the database.");
              return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("User added successfully!");
          }
        );
      });
    })
    .catch((error) => {
      console.error("Error parsing request body:", error); // Log the error
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid request body.");
    });
};

module.exports = handleSignUp;
