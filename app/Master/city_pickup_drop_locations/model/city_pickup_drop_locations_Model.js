import { pool } from "../../../../config/database/db.js";

const createCityPickupDropLocationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS city_pickup_drop_locations (
      id SERIAL PRIMARY KEY,                       
      city_id INTEGER REFERENCES cities_serviced(id), 
      address VARCHAR(200) NOT NULL,                 
      pincode VARCHAR(10),                           
      latitude DOUBLE PRECISION,                               
      longitude DOUBLE PRECISION,                              
      landmark VARCHAR(200),                         
      status SMALLINT NOT NULL  DEFAULT 1,                      
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
    );
  `;

  try {
    await pool.query(query);
    console.log("city_pickup_drop_locations table created successfully.");
  } catch (error) {
    console.error("Error creating city_pickup_drop_locations table:", error);
  }
};

export { createCityPickupDropLocationsTable };
