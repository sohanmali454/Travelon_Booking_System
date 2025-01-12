import express from "express";
import {
  createDriverAppToken,
  getDriverAppTokenByDriverId,
  getAllDriverAppTokens,
  deleteDriverAppToken,
} from "../controller/driver_app_tokens_Controller.js";

const router = express.Router();

router.post("/createDriverAppToken", createDriverAppToken);
router.get("/getAllDriverAppTokens", getAllDriverAppTokens);
router.get(
  "/getDriverAppTokenByDriverId/:driver_id",
  getDriverAppTokenByDriverId
);
router.delete("/deleteDriverAppToken/:driver_id", deleteDriverAppToken);

export default router;
