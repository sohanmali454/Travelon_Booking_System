import { pool } from "../../../../config/database/db.js";

const createCitiesServicedTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS cities_serviced (
      id SERIAL PRIMARY KEY,
      city_name VARCHAR(100) NOT NULL,
      description TEXT,
      status SMALLINT DEFAULT 1
    );
  `;

  try {
    await pool.query(query);
    console.log("cities_serviced table created successfully.");
  } catch (error) {
    console.error("Error creating cities_serviced table:", error);
  }
};

export { createCitiesServicedTable };
