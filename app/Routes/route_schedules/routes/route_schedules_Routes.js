import express from "express";
import {
  createRouteSchedule,
  getAllRouteSchedules,
  getRouteScheduleByRouteId,
  updateRouteSchedule,
  deleteRouteSchedule,
  getAllRouteSchedulesWithCity,
} from "../controller/route_schedules_Controller.js";

const router = express.Router();

router.post("/createRouteSchedule", createRouteSchedule);
router.get("/getAllRouteSchedules", getAllRouteSchedules);
router.get("/getRouteScheduleByRouteId/:id", getRouteScheduleByRouteId);
router.put("/updateRouteSchedule/:id", updateRouteSchedule);
router.delete("/deleteRouteSchedule/:id", deleteRouteSchedule);
router.get("/getAllRouteSchedulesWithCity", getAllRouteSchedulesWithCity);

export default router;
