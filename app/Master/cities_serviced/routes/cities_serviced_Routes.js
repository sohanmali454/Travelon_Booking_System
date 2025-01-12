import express from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from "../controller/cities_serviced_Controller.js";

const router = express.Router();

router.post("/createCity", createCity);
router.get("/getAllCities", getAllCities);
router.get("/getCityById/:id", getCityById);
router.put("/updateCity/:id", updateCity);
router.delete("/deleteCity/:id", deleteCity);

export default router;
