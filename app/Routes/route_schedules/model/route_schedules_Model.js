import { pool } from "../../../../config/database/db.js";

const createRouteSchedulesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS route_schedules (
      id SERIAL PRIMARY KEY,
      route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
      title VARCHAR(100),
      departure_date_time TIMESTAMPTZ NOT NULL,
      arrival_date_time TIMESTAMPTZ NOT NULL,
      details TEXT,
      capacity SMALLINT,
      seats_available SMALLINT NOT NULL,
      status SMALLINT NOT NULL DEFAULT 1, -- Default status could be 1 (active)
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Route schedules table created successfully.");
  } catch (error) {
    console.error("Error creating route schedules table:", error);
  }
};

export { createRouteSchedulesTable };
