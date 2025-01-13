import express from "express";
import {
  createVehicleType,getAllVehicleTypes,getVehicleTypeById,updateVehicleType,deleteVehicleType
} from "../controller/vehicle_types_Controller.js";

const router = express.Router();

router.post("/createVehicleType", createVehicleType);
router.get("/getAllVehicleTypes", getAllVehicleTypes);
router.get("/getVehicleTypeById/:id", getVehicleTypeById);
router.put("/updateVehicleType/:id", updateVehicleType);
router.delete("/deleteVehicleType/:id", deleteVehicleType);

export default router;
