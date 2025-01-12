import express from "express";
import {
  createDriverPassword,
  getAllDriverPasswords,
  getDriverPasswordByDriverId,
  updateDriverPassword,
  deleteDriverPassword,
} from "../controller/driver_passwords_Controller.js";

const router = express.Router();

router.post("/createDriverPassword", createDriverPassword);
router.get("/getAllDriverPasswords", getAllDriverPasswords);
router.get(
  "/getDriverPasswordByDriverId/:driver_id",
  getDriverPasswordByDriverId
);
router.put("/updateDriverPassword/:driver_id", updateDriverPassword);
router.delete("/deleteDriverPassword/:driver_id", deleteDriverPassword);

export default router;
