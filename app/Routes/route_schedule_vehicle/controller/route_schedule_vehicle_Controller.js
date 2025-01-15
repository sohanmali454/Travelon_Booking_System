import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RouteScheduleVehicleMessages } from "../utils/messages.js";
import { RouteScheduleVehicleStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE SCHEDULE VEHICLE
export const createRouteScheduleVehicle = async (req, res) => {
  const { route_schedule_id, vehicle_id, status } = req.body;

  if (!route_schedule_id || !vehicle_id || !status) {
    return errorResponse(
      res,
      RouteScheduleVehicleStatusCode.BAD_REQUEST,
      RouteScheduleVehicleMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const checkCombination = await pool.query(
      `SELECT * FROM route_schedule_vehicle WHERE route_schedule_id = $1 AND vehicle_id = $2`,
      [route_schedule_id, vehicle_id]
    );

    if (checkCombination.rows.length > 0) {
      return errorResponse(
        res,
        RouteScheduleVehicleStatusCode.BAD_REQUEST,
        RouteScheduleVehicleMessages.COMBINATION_ALREADY_EXISTS
      );
    }

    const result = await pool.query(
      `INSERT INTO route_schedule_vehicle (route_schedule_id, vehicle_id, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [route_schedule_id, vehicle_id, status]
    );

    successResponse(
      res,
      RouteScheduleVehicleStatusCode.CREATED,
      RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleVehicleStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleVehicleMessages.ERROR_CREATING_ROUTE_SCHEDULE_VEHICLE,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE VEHICLES
export const getAllRouteScheduleVehicles = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM route_schedule_vehicle`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleVehicleStatusCode.NOT_FOUND,
        RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLES_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleVehicleStatusCode.SUCCESS,
      RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleVehicleStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleVehicleMessages.ERROR_FETCHING_ROUTE_SCHEDULE_VEHICLES,
      error.message
    );
  }
};

// GET ROUTE SCHEDULE VEHICLE BY ID
export const getRouteScheduleVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM route_schedule_vehicle WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleVehicleStatusCode.NOT_FOUND,
        RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleVehicleStatusCode.SUCCESS,
      RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleVehicleStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleVehicleMessages.ERROR_FETCHING_ROUTE_SCHEDULE_VEHICLE,
      error.message
    );
  }
};

// UPDATE ROUTE SCHEDULE VEHICLE
export const updateRouteScheduleVehicle = async (req, res) => {
  const { id } = req.params;
  const { route_schedule_id, vehicle_id, status } = req.body;

  if (!route_schedule_id || !vehicle_id || !status) {
    return errorResponse(
      res,
      RouteScheduleVehicleStatusCode.BAD_REQUEST,
      RouteScheduleVehicleMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE route_schedule_vehicle SET route_schedule_id = $1, vehicle_id = $2, status = $3 WHERE id = $4 RETURNING *`,
      [route_schedule_id, vehicle_id, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleVehicleStatusCode.NOT_FOUND,
        RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleVehicleStatusCode.SUCCESS,
      RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleVehicleStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleVehicleMessages.ERROR_UPDATING_ROUTE_SCHEDULE_VEHICLE,
      error.message
    );
  }
};

// DELETE ROUTE SCHEDULE VEHICLE
export const deleteRouteScheduleVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM route_schedule_vehicle WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RouteScheduleVehicleStatusCode.NOT_FOUND,
        RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RouteScheduleVehicleStatusCode.SUCCESS,
      RouteScheduleVehicleMessages.ROUTE_SCHEDULE_VEHICLE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RouteScheduleVehicleStatusCode.INTERNAL_SERVER_ERROR,
      RouteScheduleVehicleMessages.ERROR_DELETING_ROUTE_SCHEDULE_VEHICLE,
      error.message
    );
  }
};
