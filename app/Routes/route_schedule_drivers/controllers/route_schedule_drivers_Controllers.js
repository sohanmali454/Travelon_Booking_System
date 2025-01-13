import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RouteScheduleDriverMessages } from "../utils/messages.js";
import { RouteScheduleDriverStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE SCHEDULE DRIVER
export const createRouteScheduleDriver = async (req, res) => {
  const { route_schedule_id, driver_id, status } = req.body;

  if (!route_schedule_id || !driver_id || !status) {
    return errorResponse(
      res,
      RouteScheduleDriverStatusCode.BAD_REQUEST,
      RouteScheduleDriverMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const checkCombination = await pool.query(
      `SELECT * FROM route_schedule_drivers WHERE route_schedule_id = $1 AND driver_id = $2`,
      [route_schedule_id, driver_id]
    );

    if (checkCombination.rows.length > 0) {
      return errorResponse(
        res,
        RouteScheduleDriverStatusCode.BAD_REQUEST,
        RouteScheduleDriverMessages.COMBINATION_ALREADY_EXISTS
      );
    }

    // Insert the new route_schedule_driver record
    const result = await pool.query(
      `INSERT INTO route_schedule_drivers (route_schedule_id, driver_id, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [route_schedule_id, driver_id, status]
    );

    successResponse(
      res,
      RouteScheduleDriverStatusCode.CREATED,
      RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleDriverStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleDriverMessages.ERROR_CREATING_ROUTE_SCHEDULE_DRIVER,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE DRIVERS
export const getRouteScheduleDrivers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM route_schedule_drivers`);

    successResponse(
      res,
      RouteScheduleDriverStatusCode.OK,
      RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVERS_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleDriverStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleDriverMessages.ERROR_FETCHING_ROUTE_SCHEDULE_DRIVERS,
      error.message
    );
  }
};

// GET ROUTE SCHEDULE DRIVER BY ID
export const getRouteScheduleDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM route_schedule_drivers WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleDriverStatusCode.NOT_FOUND,
        RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleDriverStatusCode.OK,
      RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_FETCHED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleDriverStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleDriverMessages.ERROR_FETCHING_ROUTE_SCHEDULE_DRIVER,
      error.message
    );
  }
};

// UPDATE ROUTE SCHEDULE DRIVER
export const updateRouteScheduleDriver = async (req, res) => {
  const { id } = req.params;
  const { route_schedule_id, driver_id, status } = req.body;

  if (!route_schedule_id || !driver_id || !status) {
    return errorResponse(
      res,
      RouteScheduleDriverStatusCode.BAD_REQUEST,
      RouteScheduleDriverMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE route_schedule_drivers 
       SET route_schedule_id = $1, driver_id = $2, status = $3 
       WHERE id = $4 RETURNING *`,
      [route_schedule_id, driver_id, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleDriverStatusCode.NOT_FOUND,
        RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleDriverStatusCode.OK,
      RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleDriverStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleDriverMessages.ERROR_UPDATING_ROUTE_SCHEDULE_DRIVER,
      error.message
    );
  }
};

// DELETE ROUTE SCHEDULE DRIVER
export const deleteRouteScheduleDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM route_schedule_drivers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleDriverStatusCode.NOT_FOUND,
        RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleDriverStatusCode.OK,
      RouteScheduleDriverMessages.ROUTE_SCHEDULE_DRIVER_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleDriverStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleDriverMessages.ERROR_DELETING_ROUTE_SCHEDULE_DRIVER,
      error.message
    );
  }
};
