import { pool } from "../../../../config/database/db.js";

const createRoutesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS routes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      source_city_id INTEGER NOT NULL REFERENCES cities_serviced(id) ON DELETE CASCADE,
      destination_city_id INTEGER NOT NULL REFERENCES cities_serviced(id) ON DELETE CASCADE,
      travel_time_in_hours DOUBLE PRECISION NOT NULL,
      details TEXT,
      remark TEXT,
      status VARCHAR(20) DEFAULT 'active',
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Routes table created successfully.");
  } catch (error) {
    console.error("Error creating routes table:", error);
  }
};

export { createRoutesTable };
