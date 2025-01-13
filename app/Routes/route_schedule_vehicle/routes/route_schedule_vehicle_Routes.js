import express from "express";
import {
  createRouteScheduleVehicle,
  getAllRouteScheduleVehicles,
  getRouteScheduleVehicleById,
  updateRouteScheduleVehicle,
  deleteRouteScheduleVehicle,
} from "../controller/route_schedule_vehicle_Controller.js";

const router = express.Router();

router.post("/createRouteScheduleVehicle", createRouteScheduleVehicle);
router.get("/getAllRouteScheduleVehicles", getAllRouteScheduleVehicles);
router.get("/getRouteScheduleVehicleById/:id", getRouteScheduleVehicleById);
router.put("/updateRouteScheduleVehicle/:id", updateRouteScheduleVehicle);
router.delete("/deleteRouteScheduleVehicle/:id", deleteRouteScheduleVehicle);

export default router;
