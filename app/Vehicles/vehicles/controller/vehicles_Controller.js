// --- vehicles_Controller.js ---
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { VehiclesMessages } from "../utils/messages.js";
import { VehiclesStatusCode } from "../utils/statusCode.js";

// CREATE VEHICLE
export const createVehicle = async (req, res) => {
  const {
    vehicle_type_id,
    passing_number,
    chasis_number,
    make_and_model,
    seating_capacity,
    fuel_type,
    color,
    remark,
    status,
  } = req.body;

  console.log("Incoming request body:", req.body);

  if (!vehicle_type_id || !status) {
    return errorResponse(
      res,
      VehiclesStatusCode.BAD_REQUEST,
      VehiclesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const existingVehicle = await pool.query(
      `SELECT * FROM vehicles WHERE passing_number = $1 OR chasis_number=$2`,
      [passing_number, chasis_number]
    );

    if (existingVehicle.rows.length > 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.BAD_REQUEST,
        VehiclesMessages.VEHICLE_ALREADY_EXISTS
      );
    }

    const result = await pool.query(
      `INSERT INTO vehicles (vehicle_type_id, passing_number, chasis_number, make_and_model, seating_capacity, fuel_type, color, remark, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        vehicle_type_id,
        passing_number,
        chasis_number,
        make_and_model,
        seating_capacity,
        fuel_type,
        color,
        remark,
        status,
      ]
    );

    successResponse(
      res,
      VehiclesStatusCode.CREATED,
      VehiclesMessages.VEHICLE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_CREATING_VEHICLE,
      error.message
    );
  }
};

// GET ALL VEHICLES
export const getAllVehicles = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, vehicle_type_id,
    passing_number,
    chasis_number,
    make_and_model,
    seating_capacity,
    fuel_type,
    color,
    remark,
    status FROM vehicles WHERE is_deleted = FALSE
`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLES_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_FETCHING_VEHICLES,
      error.message
    );
  }
};

// GET VEHICLE BY ID
export const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, vehicle_type_id,
    passing_number,
    chasis_number,
    make_and_model,
    seating_capacity,
    fuel_type,
    color,
    remark,
    status FROM vehicles WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_FETCHING_VEHICLE,
      error.message
    );
  }
};

// UPDATE VEHICLE
export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const {
    vehicle_type_id,
    passing_number,
    chasis_number,
    make_and_model,
    seating_capacity,
    fuel_type,
    color,
    remark,
    status,
  } = req.body;

  console.log("Incoming request params & body:", [req.params], req.body);

  if (!vehicle_type_id || !status) {
    return errorResponse(
      res,
      VehiclesStatusCode.BAD_REQUEST,
      VehiclesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_type_id = $1, passing_number = $2, chasis_number = $3, make_and_model = $4, seating_capacity = $5, fuel_type = $6, color = $7, remark = $8, status = $9 WHERE id = $10 AND is_deleted = FALSE RETURNING *`,
      [
        vehicle_type_id,
        passing_number,
        chasis_number,
        make_and_model,
        seating_capacity,
        fuel_type,
        color,
        remark,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_UPDATING_VEHICLE,
      error.message
    );
  }
};

// DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const existingVehicle = await pool.query(
      `SELECT * FROM vehicles WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (existingVehicle.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLE_NOT_FOUND
      );
    }

    const result = await pool.query(
      `UPDATE vehicles SET is_deleted = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_DELETING_VEHICLE,
      error.message
    );
  }
};

// GET UNIQUE VEHICLE COLORS
export const getUniqueVehicleColors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT color FROM vehicles WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLES_NOT_FOUND
      );
    }

    const uniqueColors = result.rows.map((row) => row.color);

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLE_COLOR_RETRIEVED,
      uniqueColors
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_FETCHING_VEHICLES,
      error.message
    );
  }
};

// GET All Vehicle With VehicleType

export const getAllVehicleWithVehicleType = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT vehicles.id, title, vehicle_type_id, passing_number, chasis_number, make_and_model, seating_capacity, fuel_type, color, remark, status 
   FROM vehicle_types, vehicles 
   WHERE vehicle_type_id = vehicle_types.id AND vehicles.is_deleted = FALSE 
   ORDER BY vehicles.id`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.VEHICLES_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.VEHICLES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_FETCHING_VEHICLES,
      error.message
    );
  }
};

// GET UNIQUE FUEL TYPES
export const getUniqueFuelTypes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT fuel_type FROM vehicles WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclesStatusCode.NOT_FOUND,
        VehiclesMessages.FUEL_TYPES_NOT_FOUND
      );
    }

    const uniqueFuelTypes = result.rows.map((row) => row.fuel_type);

    successResponse(
      res,
      VehiclesStatusCode.SUCCESS,
      VehiclesMessages.FUEL_TYPES_RETRIEVED,
      uniqueFuelTypes
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclesMessages.ERROR_FETCHING_VEHICLES,
      error.message
    );
  }
};
