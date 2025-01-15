import { pool } from "../../../../config/database/db.js";

const createVehiclesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_type_id SMALLINT REFERENCES vehicle_types(id),
      passing_number VARCHAR(20) UNIQUE,
      chasis_number VARCHAR(20) UNIQUE,
      make_and_model VARCHAR(200),
      seating_capacity SMALLINT,
      fuel_type VARCHAR(50),
      color VARCHAR(50),
      remark VARCHAR(500),
      status SMALLINT NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Vehicles table created successfully.");
  } catch (error) {
    console.error("Error creating vehicles table:", error);
  }
};

export { createVehiclesTable };
