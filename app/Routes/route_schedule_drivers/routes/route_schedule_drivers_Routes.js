import express from "express";
import {
  createRouteScheduleDriver,
  getRouteScheduleDrivers,
  getRouteScheduleDriverById,
  updateRouteScheduleDriver,
  deleteRouteScheduleDriver,
} from "../controllers/route_schedule_drivers_Controllers.js";

const router = express.Router();

router.post("/createRouteScheduleDriver", createRouteScheduleDriver);
router.get("/getRouteScheduleDrivers", getRouteScheduleDrivers);
router.get("/getRouteScheduleDriverById/:id", getRouteScheduleDriverById);
router.put("/updateRouteScheduleDriver/:id", updateRouteScheduleDriver);
router.delete("/deleteRouteScheduleDriver/:id", deleteRouteScheduleDriver);

export default router;
