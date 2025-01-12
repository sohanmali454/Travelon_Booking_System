import express from "express";
import {
  
createPickupLocation,getAllPickupLocations,getPickupLocationsByCityId,updatePickupLocationByCityId,deletePickupLocationByCityId} from "../controller/city_pickup_locations_Controller.js";

const router = express.Router();

router.post("/createPickupLocation", createPickupLocation);
router.get("/getAllPickupLocations", getAllPickupLocations);
router.get("/getPickupLocationsByCityId/:city_id", getPickupLocationsByCityId);
router.put(
  "/updatePickupLocationByCityId/:city_id",
  updatePickupLocationByCityId
);
router.delete(
  "/deletePickupLocationByCityId/:city_id",
  deletePickupLocationByCityId
);
export default router;
