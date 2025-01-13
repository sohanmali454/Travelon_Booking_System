import express from "express";
import {
  createRouteSchedule,
  getAllRouteSchedules,
  getRouteScheduleByRouteId,
  updateRouteSchedule,
  deleteRouteSchedule,
} from "../controller/route_schedules_Controller.js";

const router = express.Router();

router.post("/createRouteSchedule", createRouteSchedule);
router.get("/getAllRouteSchedules", getAllRouteSchedules);
router.get("/getRouteScheduleByRouteId/:route_id", getRouteScheduleByRouteId);
router.put("/updateRouteSchedule/:route_id", updateRouteSchedule);
router.delete("/deleteRouteSchedule/:route_id", deleteRouteSchedule);
export default router;
