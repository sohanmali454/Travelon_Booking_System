import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { DriversMessages } from "../utils/messages.js";
import { DriversStatusCode } from "../utils/statusCode.js";

//CREATE DRIVER

export const createDriver = async (req, res) => {
  const {
    name,
    gender,
    dob,
    mobile_number,
    alternate_contact_number,
    email,
    address,
    status,
  } = req.body;

  if (
    !name ||
    !mobile_number ||
    !gender ||
    !dob ||
    !alternate_contact_number ||
    !email ||
    !address
  ) {
    return errorResponse(
      res,
      DriversStatusCode.BAD_REQUEST,
      DriversMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO drivers (name, gender, dob, mobile_number, alternate_contact_number, email, address, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        gender,
        dob,
        mobile_number,
        alternate_contact_number,
        email,
        address,
        status,
      ]
    );

    const newDriver = result.rows[0];
    successResponse(
      res,
      DriversStatusCode.CREATED,
      DriversMessages.DRIVER_CREATED,
      newDriver
    );
  } catch (error) {
    errorResponse(
      res,
      DriversStatusCode.INTERNAL_SERVER_ERROR,
      DriversMessages.ERROR_CREATING_DRIVER,
      error.message
    );
  }
};

//GET DRIVER BY ID

export const getDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM drivers WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriversStatusCode.NOT_FOUND,
        DriversMessages.DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriversStatusCode.SUCCESS,
      DriversMessages.DRIVER_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriversStatusCode.INTERNAL_SERVER_ERROR,
      DriversMessages.ERROR_FETCHING_DRIVER,
      error.message
    );
  }
};

//UPDATE DRIVER

export const updateDriver = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    gender,
    dob,
    mobile_number,
    alternate_contact_number,
    email,
    address,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE drivers SET name = $1, gender = $2, dob = $3, mobile_number = $4, 
       alternate_contact_number = $5, email = $6, address = $7, status = $8, 
       updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *`,
      [
        name,
        gender,
        dob,
        mobile_number,
        alternate_contact_number,
        email,
        address,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriversStatusCode.NOT_FOUND,
        DriversMessages.DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriversStatusCode.SUCCESS,
      DriversMessages.DRIVER_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriversStatusCode.INTERNAL_SERVER_ERROR,
      DriversMessages.ERROR_UPDATING_DRIVER,
      error.message
    );
  }
};

//DELETE DRIVER
export const deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM drivers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriversStatusCode.NOT_FOUND,
        DriversMessages.DRIVER_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriversStatusCode.SUCCESS,
      DriversMessages.DRIVER_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriversStatusCode.INTERNAL_SERVER_ERROR,
      DriversMessages.ERROR_DELETING_DRIVER,
      error.message
    );
  }
};

//GET ALL DRIVERS
export const getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM drivers`);
    const drivers = result.rows;

    if (drivers.length === 0) {
      return errorResponse(
        res,
        DriversStatusCode.NOT_FOUND,
        DriversMessages.DRIVER_NOT_FOUND
      );
    }

    return successResponse(
      res,
      DriversStatusCode.SUCCESS,
      DriversMessages.DRIVERS_FETCHED,
      drivers
    );
  } catch (error) {
    return errorResponse(
      res,
      DriversStatusCode.INTERNAL_SERVER_ERROR,
      DriversMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};
