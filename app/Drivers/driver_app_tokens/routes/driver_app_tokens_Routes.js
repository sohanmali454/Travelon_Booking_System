import express from "express";
import {
  createDriverAppToken,
  getDriverAppTokenById,
  getAllDriverAppTokens,
  deleteDriverAppToken,
} from "../controller/driver_app_tokens_Controller.js";

const router = express.Router();

router.post("/createDriverAppToken", createDriverAppToken);
router.get("/getAllDriverAppTokens", getAllDriverAppTokens);
router.get("/getDriverAppTokenById/:id", getDriverAppTokenById);
router.delete("/deleteDriverAppToken/:id", deleteDriverAppToken);

export default router;
