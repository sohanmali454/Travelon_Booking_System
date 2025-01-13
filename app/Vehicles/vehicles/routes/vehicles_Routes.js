// --- vehicles_Routes.js ---
import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controller/vehicles_Controller.js";

const router = express.Router();

router.post("/createVehicle", createVehicle);
router.get("/getAllVehicles", getAllVehicles);
router.get("/getVehicleById/:id", getVehicleById);
router.put("/updateVehicle/:id", updateVehicle);
router.delete("/deleteVehicle/:id", deleteVehicle);

export default router;
