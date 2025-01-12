import express from "express";
import { sign_in, sign_out,  } from "../controller/adminController.js";

const router = express.Router();

router.post("/sign_in", sign_in);
router.get("/sign_out", sign_out);

export default router;
