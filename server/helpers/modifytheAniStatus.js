const db_connection = require("../database");

const updateAnimalHealth = (animalId, healthStatus) => {
  const sql = "UPDATE animals SET health_status = ? WHERE animal_id = ?";
  const values = [healthStatus, animalId];

  return new Promise((resolve, reject) => {
    db_connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating animal health:", err);
        reject({
          success: false,
          message: "Failed to update animal health status",
        });
      }

      if (result.affectedRows === 0) {
        reject({
          success: false,
          message: "Animal not found",
        });
      }

      resolve({
        success: true,
        message: "Animal health status updated successfully",
        data: { animal_id: animalId, health_status: healthStatus },
      });
    });
  });
};

module.exports = {
  updateAnimalHealth,
};
