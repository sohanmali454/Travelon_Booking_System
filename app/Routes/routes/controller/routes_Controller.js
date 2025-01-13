import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RoutesMessages } from "../utils/messages.js";
import { RoutesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE
export const createRoute = async (req, res) => {
  const {
    title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status,
  } = req.body;

  if (
    !title ||
    !source_city_id ||
    !destination_city_id ||
    !travel_time_in_hours
  ) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO routes (title, source_city_id, destination_city_id, travel_time_in_hours, details, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        title,
        source_city_id,
        destination_city_id,
        travel_time_in_hours,
        details,
        status,
      ]
    );

    successResponse(
      res,
      RoutesStatusCode.CREATED,
      RoutesMessages.ROUTE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_CREATING_ROUTE,
      error.message
    );
  }
};

// GET ROUTE BY ID
export const getRouteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM routes WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE,
      error.message
    );
  }
};

// UPDATE ROUTE
export const updateRoute = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE routes SET title = $1, source_city_id = $2, destination_city_id = $3, travel_time_in_hours = $4, details = $5, status = $6, 
       updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
      [
        title,
        source_city_id,
        destination_city_id,
        travel_time_in_hours,
        details,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_UPDATING_ROUTE,
      error.message
    );
  }
};

// DELETE ROUTE
export const deleteRoute = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM routes WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_DELETING_ROUTE,
      error.message
    );
  }
};

// GET ALL ROUTES
export const getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM routes`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};
