const getParseData = require("../getParseData");

const sign_up = async (req, res, db_connection) => {
  try {
    // Get the parsed data from the request body
    const {
      firstname,
      lastname,
      email,
      age,
      state,
      country,
      zipcode,
      address,
      city,
      mobile,
    } = await getParseData(req);

    console.log("Received data:", {
      firstname,
      lastname,
      email,
      age,
      state,
      country,
      zipcode,
      address,
      city,
      mobile,
    });

    // Validate the received data
    if (
      !firstname ||
      !lastname ||
      !email ||
      !age ||
      !state ||
      !country ||
      !zipcode ||
      !address ||
      !city ||
      !mobile
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Missing required fields" }));
      return;
    }

    // SQL query to insert the new user data into the database
    const query = `
      INSERT INTO users (firstname, lastname, email, age, state, country, zipcode, address, city, mobile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    console.log("Query values:", [
      firstname,
      lastname,
      email,
      age,
      state,
      country,
      zipcode,
      address,
      city,
      mobile,
    ]);

    // Execute the query
    db_connection.execute(
      query,
      [
        firstname,
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
          console.error("Database error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Error inserting data into the database",
              error: err.message,
            })
          );
          return;
        }

        console.log("Insert result:", result);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User created successfully!" }));
      }
    );
  } catch (error) {
    console.log("Error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error creating user :(" }));
  }
};

module.exports = { sign_up };
