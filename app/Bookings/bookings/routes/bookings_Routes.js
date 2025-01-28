import express from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controller/bookings_Controller.js";

const router = express.Router();

router.post("/createBooking", createBooking);
router.get("/getAllBookings", getAllBookings);
router.get("/getBookingById/:id", getBookingById);
router.put("/updateBooking/:id", updateBooking);
router.delete("/deleteBooking/:id", deleteBooking);

export default router;
