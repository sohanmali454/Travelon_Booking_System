import { pool } from "../../../../config/database/db.js";

const createDriverPasswordsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS driver_passwords (
      id SERIAL PRIMARY KEY,
      driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
      password VARCHAR(500) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Driver Passwords table created successfully.");
  } catch (error) {
    console.error("Error creating driver passwords table:", error);
  }
};

export { createDriverPasswordsTable };
