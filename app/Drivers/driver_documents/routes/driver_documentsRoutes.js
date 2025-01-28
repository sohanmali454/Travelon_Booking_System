import express from "express";
import {
  getDriverDocumentById,
  updateDriverDocument,
  deleteDriverDocument,
  getAllDriverDocuments,
  createAndUploadDriverDocument,
} from "../controller/driver_documentsController.js";

const router = express.Router();

router.post("/createAndUploadDriverDocument", createAndUploadDriverDocument);

router.get("/getDriverDocumentById/:id", getDriverDocumentById);

router.put("/updateDriverDocument/:id", updateDriverDocument);

router.delete("/deleteDriverDocument/:id", deleteDriverDocument);

router.get("/getAllDriverDocuments", getAllDriverDocuments);

export default router;
