import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RoutesMessages } from "../utils/messages.js";
import { RoutesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE SCHEDULE
export const createRouteSchedule = async (req, res) => {
  const {
    route_id,
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status,
  } = req.body;

  if (
    !route_id ||
    !title ||
    !departure_date_time ||
    !arrival_date_time ||
    !capacity
  ) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO route_schedules (route_id, title, departure_date_time, arrival_date_time, details, capacity, seats_available, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        route_id,
        title,
        departure_date_time,
        arrival_date_time,
        details,
        capacity,
        seats_available,
        status,
      ]
    );

    successResponse(
      res,
      RoutesStatusCode.CREATED,
      RoutesMessages.ROUTE_SCHEDULE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_CREATING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE
export const getAllRouteSchedules = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM route_schedules`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// GET ROUTE SCHEDULE BY ROUTE ID
export const getRouteScheduleByRouteId = async (req, res) => {
  const { route_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM route_schedules WHERE route_id = $1`,
      [route_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// UPDATE ROUTE SCHEDULE
export const updateRouteSchedule = async (req, res) => {
  const { route_id } = req.params;
  const {
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE route_schedules 
       SET title = $1, departure_date_time = $2, arrival_date_time = $3, details = $4, capacity = $5, seats_available = $6, status = $7 
       WHERE route_id = $8 RETURNING *`,
      [
        title,
        departure_date_time,
        arrival_date_time,
        details,
        capacity,
        seats_available,
        status,
        route_id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_UPDATING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// DELETE ROUTE SCHEDULE
export const deleteRouteSchedule = async (req, res) => {
  const { route_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM route_schedules WHERE route_id = $1 RETURNING *`,
      [route_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_DELETING_ROUTE_SCHEDULE,
      error.message
    );
  }
};
