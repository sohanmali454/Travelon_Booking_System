import express from "express";
import {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controller/driverController.js";

const router = express.Router();

router.post("/createDriver", createDriver);
router.get("/getAllDrivers", getAllDrivers);
router.get("/getDriverById/:id", getDriverById);
router.put("/updateDriver/:id", updateDriver);
router.delete("/deleteDriver/:id", deleteDriver);

export default router;
