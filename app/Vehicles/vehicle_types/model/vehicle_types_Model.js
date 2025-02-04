import { pool } from "../../../../config/database/db.js";

const createVehicleTypesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS vehicle_types (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Vehicle types table created successfully.");
  } catch (error) {
    console.error("Error creating vehicle types table:", error);
  }
};

export { createVehicleTypesTable };
