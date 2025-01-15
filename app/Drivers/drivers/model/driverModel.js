import { pool } from "../../../../config/database/db.js";

const createDriversTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      gender VARCHAR(10) NOT NULL,
      dob DATE NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      alternate_contact_number VARCHAR(15) NOT NULL,
      email VARCHAR(100) UNIQUE  NOT NULL,
      address VARCHAR(100) NOT NULL,
      added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20),      
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

    ); `;

  try {
    await pool.query(query);
    console.log("Drivers table created successfully.");
  } catch (error) {
    console.error("Error creating drivers table:", error);
  }
};

export { createDriversTable };
