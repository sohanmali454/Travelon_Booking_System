import express from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "../controller/routes_Controller.js";

const router = express.Router();

router.post("/createRoute", createRoute);
router.get("/getAllRoutes", getAllRoutes);
router.get("/getRouteById/:id", getRouteById);
router.put("/updateRoute/:id", updateRoute);
router.delete("/deleteRoute/:id", deleteRoute);

export default router;
