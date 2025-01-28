import express from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRoutesBySourceCityId,
  getRoutesByDestinationCityId,
  getRoutesBySourceAndDestination,
  getRoutesBySourceAllCity,
  getRoutesByDestinationAllCity,
} from "../controller/routes_Controller.js";

const router = express.Router();

router.post("/createRoute", createRoute);
router.get("/getAllRoutes", getAllRoutes);
router.get("/getRouteById/:id", getRouteById);
router.put("/updateRoute/:id", updateRoute);
router.delete("/deleteRoute/:id", deleteRoute);
router.get("/getRoutesBySourceAllCity", getRoutesBySourceAllCity);
router.get("/getRoutesBySourceCityId", getRoutesBySourceCityId);
router.get("/getRoutesByDestinationAllCity", getRoutesByDestinationAllCity);
router.get("/getRoutesByDestinationCityId", getRoutesByDestinationCityId);
router.get("/getRoutesBySourceAndDestination", getRoutesBySourceAndDestination);

export default router;
