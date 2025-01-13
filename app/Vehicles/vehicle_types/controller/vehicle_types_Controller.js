import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { VehicleTypesMessages } from "../utils/messages.js";
import { VehicleTypesStatusCode } from "../utils/statusCode.js";

// CREATE VEHICLE TYPE
export const createVehicleType = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return errorResponse(
      res,
      VehicleTypesStatusCode.BAD_REQUEST,
      VehicleTypesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO vehicle_types (title) VALUES ($1) RETURNING *`,
      [title]
    );

    successResponse(
      res,
      VehicleTypesStatusCode.CREATED,
      VehicleTypesMessages.VEHICLE_TYPE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehicleTypesStatusCode.INTERNAL_SERVER_ERROR,
      VehicleTypesMessages.ERROR_CREATING_VEHICLE_TYPE,
      error.message
    );
  }
};

// GET ALL VEHICLE TYPES
export const getAllVehicleTypes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicle_types`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehicleTypesStatusCode.NOT_FOUND,
        VehicleTypesMessages.VEHICLE_TYPES_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehicleTypesStatusCode.SUCCESS,
      VehicleTypesMessages.VEHICLE_TYPES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      VehicleTypesStatusCode.INTERNAL_SERVER_ERROR,
      VehicleTypesMessages.ERROR_FETCHING_VEHICLE_TYPES,
      error.message
    );
  }
};

// GET VEHICLE TYPE BY ID
export const getVehicleTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM vehicle_types WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehicleTypesStatusCode.NOT_FOUND,
        VehicleTypesMessages.VEHICLE_TYPE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehicleTypesStatusCode.SUCCESS,
      VehicleTypesMessages.VEHICLE_TYPE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehicleTypesStatusCode.INTERNAL_SERVER_ERROR,
      VehicleTypesMessages.ERROR_FETCHING_VEHICLE_TYPE,
      error.message
    );
  }
};

// UPDATE VEHICLE TYPE
export const updateVehicleType = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return errorResponse(
      res,
      VehicleTypesStatusCode.BAD_REQUEST,
      VehicleTypesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE vehicle_types SET title = $1 WHERE id = $2 RETURNING *`,
      [title, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehicleTypesStatusCode.NOT_FOUND,
        VehicleTypesMessages.VEHICLE_TYPE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehicleTypesStatusCode.SUCCESS,
      VehicleTypesMessages.VEHICLE_TYPE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehicleTypesStatusCode.INTERNAL_SERVER_ERROR,
      VehicleTypesMessages.ERROR_UPDATING_VEHICLE_TYPE,
      error.message
    );
  }
};

// DELETE VEHICLE TYPE
export const deleteVehicleType = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM vehicle_types WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehicleTypesStatusCode.NOT_FOUND,
        VehicleTypesMessages.VEHICLE_TYPE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehicleTypesStatusCode.SUCCESS,
      VehicleTypesMessages.VEHICLE_TYPE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehicleTypesStatusCode.INTERNAL_SERVER_ERROR,
      VehicleTypesMessages.ERROR_DELETING_VEHICLE_TYPE,
      error.message
    );
  }
};
