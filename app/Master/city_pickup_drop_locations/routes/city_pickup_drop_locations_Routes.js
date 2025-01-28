import express from "express";
import {
  createPickupDropLocation,
  getAllPickupDropLocations,
  getPickupDropLocationById,
  updatePickupDropLocation,
  deletePickupDropLocation,
  createPickUpAndDropLocation,
  deletePickUpAndDropLocation,
  createCityAndPickupDropLocation,
  addCityWithMultipleAddresses,
  getCityWithMultipleAddresses,
} from "../controller/city_pickup_drop_locations_Controller.js";

const router = express.Router();

router.post("/createPickupDrop", createPickupDropLocation);
router.get("/getAllPickupDrops", getAllPickupDropLocations);
router.get("/getPickupDropById/:id", getPickupDropLocationById);
router.put("/updatePickupDrop/:id", updatePickupDropLocation);
router.delete("/deletePickupDrop/:id", deletePickupDropLocation);
router.post("/createPickUpLocation", createPickUpAndDropLocation);
router.post(
  "/createCityAndPickupDropLocation",
  createCityAndPickupDropLocation
);
router.post("/city_with_multiple_addresses", addCityWithMultipleAddresses);
router.get("/city_with_multiple_addresses", getCityWithMultipleAddresses);

export default router;
