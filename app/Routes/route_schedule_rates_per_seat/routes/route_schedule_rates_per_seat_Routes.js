import express from "express";
import {
  createRouteScheduleRate,
  getAllRouteScheduleRates,
  getRouteScheduleRateById,
  updateRouteScheduleRate,
  deleteRouteScheduleRate,
} from "../controller/route_schedule_rates_per_seat_Controller.js";

const router = express.Router();

router.post("/createRouteScheduleRate", createRouteScheduleRate);
router.get("/getAllRouteScheduleRates", getAllRouteScheduleRates);
router.get(
  "/getRouteScheduleRateById/:route_schedule_id",
  getRouteScheduleRateById
);
router.put("/updateRouteScheduleRate/:id", updateRouteScheduleRate);
router.delete("/deleteRouteScheduleRate/:id", deleteRouteScheduleRate);

export default router;
