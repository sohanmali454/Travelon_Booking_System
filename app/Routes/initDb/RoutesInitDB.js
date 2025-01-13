import { createRouteScheduleDriversTable } from "../route_schedule_drivers/model/route_schedule_drivers_Model.js";
import { createRouteScheduleVehicleTable } from "../route_schedule_vehicle/model/route_schedule_vehicle_Model.js";
import { createRouteSchedulesTable } from "../route_schedules/model/route_schedules_Model.js";
import { createRoutesTable } from "../routes/model/routes_Model.js";

const initializeRoutesDB = async () => {
  try {
    await createRoutesTable();
    await createRouteSchedulesTable();
    await createRouteScheduleVehicleTable();
    await createRouteScheduleDriversTable();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeRoutesDB;
