import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { BookingsMessages } from "../utils/messages.js";
import { BookingsStatusCode } from "../utils/statusCode.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  const {
    user_id,
    route_schedule_id,
    booking_date_time,
    pnr_number,
    contact_number,
    email,
    number_of_seats,
    booking_status,
    status,
  } = req.body;

  console.log("Incoming request body:", req.body);

  const contactRegex = /^[0-9]{10,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (
    !user_id ||
    !route_schedule_id ||
    !booking_date_time ||
    !pnr_number ||
    !contact_number ||
    !number_of_seats ||
    !booking_status ||
    !status
  ) {
    return errorResponse(
      res,
      BookingsStatusCode.BAD_REQUEST,
      BookingsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  if (!contactRegex.test(contact_number)) {
    return errorResponse(
      res,
      BookingsStatusCode.BAD_REQUEST,
      BookingsMessages.INVALID_CONTACT_NUMBER
    );
  }

  if (email && !emailRegex.test(email)) {
    return errorResponse(
      res,
      BookingsStatusCode.BAD_REQUEST,
      BookingsMessages.INVALID_EMAIL
    );
  }

  if (
    !user_id ||
    !route_schedule_id ||
    !booking_date_time ||
    !pnr_number ||
    !contact_number ||
    !number_of_seats ||
    !booking_status ||
    !status
  ) {
    return errorResponse(
      res,
      BookingsStatusCode.BAD_REQUEST,
      BookingsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, route_schedule_id, booking_date_time, pnr_number, contact_number, email, number_of_seats, booking_status, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        user_id,
        route_schedule_id,
        booking_date_time,
        pnr_number,
        contact_number,
        email,
        number_of_seats,
        booking_status,
        status,
      ]
    );

    const newBooking = result.rows[0];
    successResponse(
      res,
      BookingsStatusCode.CREATED,
      BookingsMessages.BOOKING_CREATED,
      newBooking
    );
  } catch (error) {
    errorResponse(
      res,
      BookingsStatusCode.INTERNAL_SERVER_ERROR,
      BookingsMessages.ERROR_CREATING_BOOKING,
      error.message
    );
  }
};

// GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE is_deleted = FALSE`
    );
    const bookings = result.rows;

    if (bookings.length === 0) {
      return errorResponse(
        res,
        BookingsStatusCode.NOT_FOUND,
        BookingsMessages.BOOKINGS_NOT_FOUND
      );
    }

    return successResponse(
      res,
      BookingsStatusCode.SUCCESS,
      BookingsMessages.BOOKINGS_FETCHED,
      bookings
    );
  } catch (error) {
    return errorResponse(
      res,
      BookingsStatusCode.INTERNAL_SERVER_ERROR,
      BookingsMessages.ERROR_FETCHING_BOOKINGS,
      error.message
    );
  }
};

// GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        BookingsStatusCode.NOT_FOUND,
        BookingsMessages.BOOKING_NOT_FOUND
      );
    }

    successResponse(
      res,
      BookingsStatusCode.SUCCESS,
      BookingsMessages.BOOKING_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      BookingsStatusCode.INTERNAL_SERVER_ERROR,
      BookingsMessages.ERROR_FETCHING_BOOKING,
      error.message
    );
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    route_schedule_id,
    booking_date_time,
    pnr_number,
    contact_number,
    email,
    number_of_seats,
    booking_status,
    status,
  } = req.body;

   console.log("Incoming request params & body:", [req.params], req.body);

   const contactRegex = /^[0-9]{10,20}$/;
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

   if (!contactRegex.test(contact_number)) {
     return errorResponse(
       res,
       BookingsStatusCode.BAD_REQUEST,
       BookingsMessages.INVALID_CONTACT_NUMBER
     );
   }

   if (email && !emailRegex.test(email)) {
     return errorResponse(
       res,
       BookingsStatusCode.BAD_REQUEST,
       BookingsMessages.INVALID_EMAIL
     );
   }

  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET user_id = $1, route_schedule_id = $2, booking_date_time = $3, 
           pnr_number = $4, contact_number = $5, email = $6, number_of_seats = $7, 
           booking_status = $8, status = $9, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $10 AND is_deleted = FALSE 
       RETURNING *`,
      [
        user_id,
        route_schedule_id,
        booking_date_time,
        pnr_number,
        contact_number,
        email,
        number_of_seats,
        booking_status,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        BookingsStatusCode.NOT_FOUND,
        BookingsMessages.BOOKING_NOT_FOUND
      );
    }

    successResponse(
      res,
      BookingsStatusCode.SUCCESS,
      BookingsMessages.BOOKING_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      BookingsStatusCode.INTERNAL_SERVER_ERROR,
      BookingsMessages.ERROR_UPDATING_BOOKING,
      error.message
    );
  }
};

// DELETE BOOKING (SOFT DELETE)
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET is_deleted = TRUE 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        BookingsStatusCode.NOT_FOUND,
        BookingsMessages.BOOKING_NOT_FOUND
      );
    }

    successResponse(
      res,
      BookingsStatusCode.SUCCESS,
      BookingsMessages.BOOKING_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      BookingsStatusCode.INTERNAL_SERVER_ERROR,
      BookingsMessages.ERROR_DELETING_BOOKING,
      error.message
    );
  }
};
