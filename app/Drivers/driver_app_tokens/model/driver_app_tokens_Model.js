import { pool } from "../../../../config/database/db.js";

const createDriverAppTokensTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS driver_app_tokens (
      id SERIAL PRIMARY KEY,
      driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
      app_token VARCHAR(255) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Driver App Tokens table created successfully.");
  } catch (error) {
    console.error("Error creating driver app tokens table:", error);
  }
};

export { createDriverAppTokensTable };
