import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RouteScheduleRatesMessages } from "../utils/messages.js";
import { RouteScheduleRatesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE SCHEDULE RATE PER SEAT
export const createRouteScheduleRate = async (req, res) => {
  const { route_schedule_id, rate, from_date_time, to_date_time, status } =
    req.body;

  if (!route_schedule_id || !rate || !from_date_time || status === undefined) {
    return errorResponse(
      res,
      RouteScheduleRatesStatusCode.BAD_REQUEST,
      RouteScheduleRatesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const scheduleCheck = await pool.query(
      `SELECT id FROM route_schedules WHERE id = $1`,
      [route_schedule_id]
    );

    if (scheduleCheck.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleRatesStatusCode.NOT_FOUND,
        RouteScheduleRatesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    const result = await pool.query(
      `INSERT INTO route_schedule_rates_per_seat 
       (route_schedule_id, rate, from_date_time, to_date_time, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [route_schedule_id, rate, from_date_time, to_date_time, status]
    );

    successResponse(
      res,
      RouteScheduleRatesStatusCode.CREATED,
      RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleRatesMessages.ERROR_CREATING_ROUTE_SCHEDULE_RATE,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE RATES PER SEAT
export const getAllRouteScheduleRates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, route_schedule_id, rate, from_date_time, to_date_time, status 
       FROM route_schedule_rates_per_seat 
       WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleRatesStatusCode.NOT_FOUND,
        RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleRatesStatusCode.SUCCESS,
      RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleRatesMessages.ERROR_FETCHING_ROUTE_SCHEDULE_RATES,
      error.message
    );
  }
};

// UPDATE ROUTE SCHEDULE RATE PER SEAT
export const updateRouteScheduleRate = async (req, res) => {
  const { id } = req.params;
  const { route_schedule_id, rate, from_date_time, to_date_time, status } =
    req.body;

  if (!route_schedule_id || !rate || !from_date_time || status === undefined) {
    return errorResponse(
      res,
      RouteScheduleRatesStatusCode.BAD_REQUEST,
      RouteScheduleRatesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE route_schedule_rates_per_seat 
       SET route_schedule_id = $1, rate = $2, from_date_time = $3, to_date_time = $4, status = $5 
       WHERE id = $6 AND is_deleted = FALSE RETURNING *`,
      [route_schedule_id, rate, from_date_time, to_date_time, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleRatesStatusCode.NOT_FOUND,
        RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleRatesStatusCode.SUCCESS,
      RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleRatesMessages.ERROR_UPDATING_ROUTE_SCHEDULE_RATE,
      error.message
    );
  }
};

// SOFT DELETE ROUTE SCHEDULE RATE PER SEAT
export const deleteRouteScheduleRate = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE route_schedule_rates_per_seat 
       SET is_deleted = TRUE 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleRatesStatusCode.NOT_FOUND,
        RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleRatesStatusCode.SUCCESS,
      RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleRatesMessages.ERROR_DELETING_ROUTE_SCHEDULE_RATE,
      error.message
    );
  }
};

export const getRouteScheduleRateById = async (req, res) => {
  const { route_schedule_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT route_schedule_id, rate, from_date_time, to_date_time 
       FROM route_schedule_rates_per_seat 
       WHERE route_schedule_id = $1 AND is_deleted = FALSE`,
      [route_schedule_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleRatesStatusCode.NOT_FOUND,
        RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_NOT_FOUND
      );
    }

    const formatDate = (date) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString("en-GB", options).toUpperCase();
    };

    const rates = result.rows.map((row) => ({
      from_to_rate: `${formatDate(row.from_date_time)} to ${
        row.to_date_time ? formatDate(row.to_date_time) : "N/A"
      } : ${row.rate}`,
    }));

    successResponse(
      res,
      RouteScheduleRatesStatusCode.SUCCESS,
      RouteScheduleRatesMessages.ROUTE_SCHEDULE_RATE_RETRIEVED,
      { route_schedule_id: route_schedule_id, rates }
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleRatesMessages.ERROR_FETCHING_ROUTE_SCHEDULE_RATES,
      error.message
    );
  }
};
