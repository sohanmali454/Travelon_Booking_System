// --- vehicles_Routes.js ---
import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getUniqueVehicleColors,
  getUniqueFuelTypes,
  getAllVehicleWithVehicleType,
} from "../controller/vehicles_Controller.js";

const router = express.Router();

router.post("/createVehicle", createVehicle);
router.get("/getAllVehicles", getAllVehicles);
router.get("/getVehicleById/:id", getVehicleById);
router.put("/updateVehicle/:id", updateVehicle);
router.delete("/deleteVehicle/:id", deleteVehicle);
router.get("/getUniqueVehicleColors/", getUniqueVehicleColors);
router.get("/getUniqueFuelTypes/", getUniqueFuelTypes);
router.get("/getAllVehicleWithVehicleType/", getAllVehicleWithVehicleType);

export default router;
