import express from "express";
import {
  createDropLocation,
  getAllDropLocations,
  getDropLocationsByCityId,
  updateDropLocationByCityId,
  deleteDropLocationByCityId,
} from "../controllers/city_drop_locations_Controller.js";

const router = express.Router();

router.post("/createDropLocation", createDropLocation);
router.get("/getAllDropLocations", getAllDropLocations);
router.get("/getDropLocationsByCityId/:city_id", getDropLocationsByCityId);
router.put("/updateDropLocationByCityId/:city_id", updateDropLocationByCityId);
router.delete(
  "/deleteDropLocationByCityId/:city_id",
  deleteDropLocationByCityId
);

export default router;
