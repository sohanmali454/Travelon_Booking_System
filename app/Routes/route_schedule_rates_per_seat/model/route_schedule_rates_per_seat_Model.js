import { pool } from "../../../../config/database/db.js";

const createRouteScheduleRatesPerSeatTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS route_schedule_rates_per_seat (
      id SERIAL PRIMARY KEY,
      route_schedule_id INTEGER REFERENCES route_schedules(id),
      rate FLOAT NOT NULL,
      from_date_time TIMESTAMP NOT NULL,
      to_date_time TIMESTAMP,
      status SMALLINT NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Route schedule rates per seat table created successfully.");
  } catch (error) {
    console.error(
      "Error creating route schedule rates per seat table:",
      error.message
    );
  }
};

export { createRouteScheduleRatesPerSeatTable };
