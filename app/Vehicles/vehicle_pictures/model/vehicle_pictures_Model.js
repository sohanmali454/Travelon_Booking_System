// --- createVehiclePicturesTable.js ---
import { pool } from "../../../../config/database/db.js";

const createVehiclePicturesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS vehicle_pictures (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      image_url VARCHAR(200) NOT NULL,
      status SMALLINT
    );
  `;

  try {
    await pool.query(query);
    console.log("Vehicle pictures table created successfully.");
  } catch (error) {
    console.error("Error creating vehicle pictures table:", error);
  }
};

export { createVehiclePicturesTable };
