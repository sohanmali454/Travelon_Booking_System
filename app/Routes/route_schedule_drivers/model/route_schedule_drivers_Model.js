import { pool } from "../../../../config/database/db.js";

const createRouteScheduleDriversTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS route_schedule_drivers (
      id SERIAL PRIMARY KEY,
      route_schedule_id INTEGER REFERENCES route_schedules(id) ON DELETE CASCADE,
      driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
      status SMALLINT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Route schedule drivers table created successfully.");
  } catch (error) {
    console.error("Error creating route schedule drivers table:", error);
  }
};

export { createRouteScheduleDriversTable };
