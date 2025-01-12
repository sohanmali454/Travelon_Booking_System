import { pool } from "../../../../config/database/db.js";

const createCityDropLocationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS city_drop_locations (
      id SERIAL PRIMARY KEY,
      city_id INTEGER REFERENCES cities_serviced(id) ON DELETE CASCADE,
      address VARCHAR(200) NOT NULL,
      pincode VARCHAR(10),
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      landmark VARCHAR(200),
      status SMALLINT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("city_drop_locations table created successfully.");
  } catch (error) {
    console.error("Error creating city_drop_locations table:", error);
  }
};

export { createCityDropLocationsTable };
