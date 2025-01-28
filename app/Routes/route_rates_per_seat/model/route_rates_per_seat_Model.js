import { pool } from "../../../../config/database/db.js";

const createRouteRatesPerSeatTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS route_rates_per_seat (
      id SERIAL PRIMARY KEY,
      route_id INTEGER REFERENCES routes(id),
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
    console.log("Route rates per seat table created successfully.");
  } catch (error) {
    console.error("Error creating route rates per seat table:", error);
  }
};

export { createRouteRatesPerSeatTable };
