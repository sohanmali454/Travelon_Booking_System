import { pool } from "../../../../config/database/db.js";

const createDriverDocumentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS driver_documents (
      id SERIAL PRIMARY KEY,
      driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
      document_type SMALLINT NOT NULL,
      document_url TEXT,
      status VARCHAR(20),
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Driver Documents table created successfully.");
  } catch (error) {
    console.error("Error creating driver documents table:", error);
  }
};

export { createDriverDocumentsTable };
