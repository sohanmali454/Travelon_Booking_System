import { pool } from "../../../../config/database/db.js";

const createBookingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      route_schedule_id INTEGER NOT NULL,
      booking_date_time TIMESTAMP NOT NULL,
      pnr_number VARCHAR(20) NOT NULL,
      contact_number VARCHAR(20) NOT NULL,
      email VARCHAR(100),
      number_of_seats SMALLINT NOT NULL,
      booking_status SMALLINT,
      status SMALLINT NOT NULL,
      is_deleted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Bookings table created successfully.");
  } catch (error) {
    console.error("Error creating bookings table:", error);
  }
};

export { createBookingsTable };
