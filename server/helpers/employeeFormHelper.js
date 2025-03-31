const db_connection = require("../database");

function handleEmployeeForm(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const formData = JSON.parse(body);
        const { action, Employee_id, first_name, last_name, date_of_birth, salary, user_name, department_id, gender, email, phone} = formData;
        const Manager_id = formData.Manager_id || null;
        const Minit_name = formData.Minit_name || null;
        const street_address = formData.street_address || null;
        const city = formData.city || null;
        const state = formData.state || null;
        const zip_code = formData.zip_code || null;
        const country = formData.country || null;
        if (action === "add") {
          if (!first_name || !last_name || !date_of_birth || !salary || !user_name || !department_id || !gender || !email || !phone) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "All * fields are required" }));
            return;
          }

        const sql = "INSERT INTO employees (first_name, last_name, date_of_birth, salary, user_name, department_id, gender, email, phone, Manager_id, Minit_name, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [first_name, last_name, date_of_birth, salary, user_name, department_id, gender, email, phone, Manager_id, Minit_name, street_address, city, state, zip_code, country];

        db_connection.query(sql, values, (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Database error" }));
            return;
          }

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Employee added successfully", id: result.insertId }));
        });

      } else if (action === "update") {
        if (!first_name || !last_name || !date_of_birth || !salary || !user_name || !department_id || !gender || !email || !phone) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "All * fields are required for update" }));
          return;
        }

        const sql = "UPDATE employees SET first_name = ?, last_name = ?, date_of_birth = ?, salary = ?, user_name = ?, department_id = ?, gender = ?, email = ?, phone = ?, Manager_id = ?, Minit_name = ?, street_address = ?, city = ?, state = ?, zip_code = ?, country = ? WHERE Employee_id = ?";
        const values = [first_name, last_name, date_of_birth, salary, user_name, department_id, gender, email, phone, Manager_id, Minit_name, street_address, city, state, zip_code, country, Employee_id];

        db_connection.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Database error" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Employee updated successfully" }));
        });

      } else if (action === "delete") {
          if (!Employee_id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Employee ID is required for deletion" }));
            return;
          }

          const sql = "DELETE FROM employees WHERE Employee_id = ?";
          db_connection.query(sql, [Employee_id], (err, result) => {
          if (err) {
              console.error("Database delete error:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, message: "Database error" }));
              return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Employee deleted successfully" }));
          });

        } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid action" }));
          }
      
    } catch (error) {
          console.error("Error parsing request body:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
        }
  });
}
module.exports = handleEmployeeForm;