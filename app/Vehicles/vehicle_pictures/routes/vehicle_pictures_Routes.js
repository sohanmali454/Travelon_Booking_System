import express from "express";
import {
  createAndUploadVehiclePicture,
  getAllVehiclePictures,
  getVehiclePictureById,
  updateVehiclePicture,
  deleteVehiclePicture,
} from "../controller/vehicle_pictures_Controller.js";

const router = express.Router();

router.post("/createAndUploadVehiclePicture", createAndUploadVehiclePicture);
router.get("/getAllVehiclePictures", getAllVehiclePictures);
router.get("/getVehiclePictureById/:id", getVehiclePictureById);
router.put("/updateVehiclePicture/:id", updateVehiclePicture);
router.delete("/deleteVehiclePicture/:id", deleteVehiclePicture);

export default router;
