import { pool } from "../../../../config/database/db.js";

const createRouteScheduleVehicleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS route_schedule_vehicle (
      id SERIAL PRIMARY KEY,
      route_schedule_id INTEGER REFERENCES route_schedules(id),
      vehicle_id INTEGER REFERENCES vehicles(id),
      status SMALLINT NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log("Route Schedule Vehicle table created successfully.");
  } catch (error) {
    console.error("Error creating route_schedule_vehicle table:", error);
  }
};

export { createRouteScheduleVehicleTable };
