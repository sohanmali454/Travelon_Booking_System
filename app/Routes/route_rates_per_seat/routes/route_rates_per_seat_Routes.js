import express from "express";
import {
  createRouteRatePerSeat,
  getAllRouteRates,
  getRouteRateById,
  updateRouteRate,
  deleteRouteRate,
} from "../controller/route_rates_per_seat_Controller.js";

const router = express.Router();

router.post("/createRouteRatePerSeat", createRouteRatePerSeat);
router.get("/getAllRouteRates", getAllRouteRates);
router.get("/getRouteRateById/:id", getRouteRateById);
router.put("/updateRouteRate/:id", updateRouteRate);
router.delete("/deleteRouteRate/:id", deleteRouteRate);

export default router;
