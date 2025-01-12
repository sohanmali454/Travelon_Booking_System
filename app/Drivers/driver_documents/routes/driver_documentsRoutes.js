import express from "express";
import {
  createDriverDocument,
  getDriverDocumentByDriverId,
  updateDriverDocument,
  deleteDriverDocument,
  getAllDriverDocuments,
} from "../controller/driver_documentsController.js";

const router = express.Router();

router.post("/createDriverDocument", createDriverDocument);

router.get(
  "/getDriverDocumentByDriverId/:driver_id",
  getDriverDocumentByDriverId
);

router.put("/updateDriverDocument/:driver_id", updateDriverDocument);

router.delete("/deleteDriverDocument/:driver_id", deleteDriverDocument);

router.get("/getAllDriverDocuments", getAllDriverDocuments);

export default router;
