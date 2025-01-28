import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RouteRatesMessages } from "../utils/messages.js";
import { RouteRatesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE RATE
export const createRouteRatePerSeat = async (req, res) => {
  const { route_id, rate, from_date_time, to_date_time, status } = req.body;
  console.log("Incoming request body:", req.body);

  if (!route_id || !rate || !from_date_time || status === undefined) {
    return errorResponse(
      res,
      RouteRatesStatusCode.BAD_REQUEST,
      RouteRatesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const routeCheck = await pool.query(`SELECT id FROM routes WHERE id = $1`, [
      route_id,
    ]);
    if (routeCheck.rows.length === 0) {
      return errorResponse(
        res,
        RouteRatesStatusCode.NOT_FOUND,
        RouteRatesMessages.ROUTE_NOT_FOUND
      );
    }

    const result = await pool.query(
      `INSERT INTO route_rates_per_seat (route_id, rate, from_date_time, to_date_time, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [route_id, rate, from_date_time, to_date_time, status]
    );

    successResponse(
      res,
      RouteRatesStatusCode.CREATED,
      RouteRatesMessages.ROUTE_RATE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteRatesMessages.ERROR_CREATING_ROUTE_RATE,
      error.message
    );
  }
};

// GET ALL ROUTE RATES
export const getAllRouteRates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,route_id, rate, from_date_time, to_date_time, status  FROM route_rates_per_seat WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteRatesStatusCode.NOT_FOUND,
        RouteRatesMessages.ROUTE_RATES_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteRatesStatusCode.SUCCESS,
      RouteRatesMessages.ROUTE_RATES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RouteRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteRatesMessages.ERROR_FETCHING_ROUTE_RATES,
      error.message
    );
  }
};

// GET ROUTE RATE BY ID
export const getRouteRateById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id,route_id, rate, from_date_time, to_date_time, status  FROM route_rates_per_seat WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteRatesStatusCode.NOT_FOUND,
        RouteRatesMessages.ROUTE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteRatesStatusCode.SUCCESS,
      RouteRatesMessages.ROUTE_RATE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteRatesMessages.ERROR_FETCHING_ROUTE_RATE,
      error.message
    );
  }
};

// UPDATE ROUTE RATE
export const updateRouteRate = async (req, res) => {
  const { id } = req.params;
  const { route_id, rate, from_date_time, to_date_time, status } = req.body;
  console.log("Incoming request params & body:", [req.params], req.body);

  if (!route_id || !rate || !from_date_time || !status) {
    return errorResponse(
      res,
      RouteRatesStatusCode.BAD_REQUEST,
      RouteRatesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE route_rates_per_seat SET route_id = $1, rate = $2, from_date_time = $3, to_date_time = $4, status = $5 
       WHERE id = $6 RETURNING *`,
      [route_id, rate, from_date_time, to_date_time, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteRatesStatusCode.NOT_FOUND,
        RouteRatesMessages.ROUTE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteRatesStatusCode.SUCCESS,
      RouteRatesMessages.ROUTE_RATE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteRatesMessages.ERROR_UPDATING_ROUTE_RATE,
      error.message
    );
  }
};

// SOFT DELETE ROUTE RATE
export const deleteRouteRate = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE route_rates_per_seat SET is_deleted = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteRatesStatusCode.NOT_FOUND,
        RouteRatesMessages.ROUTE_RATE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteRatesStatusCode.SUCCESS,
      RouteRatesMessages.ROUTE_RATE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteRatesStatusCode.INTERNAL_SERVER_ERROR,
      RouteRatesMessages.ERROR_DELETING_ROUTE_RATE,
      error.message
    );
  }
};
