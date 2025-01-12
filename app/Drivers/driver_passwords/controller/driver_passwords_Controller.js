import bcrypt from "bcryptjs";
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { DriverPasswordMessages } from "../utils/messages.js";
import { DriverPasswordStatusCode } from "../utils/statusCode.js";

// CREATE DRIVER PASSWORD
export const createDriverPassword = async (req, res) => {
  const { driver_id, password } = req.body;

  if (!driver_id || !password) {
    return errorResponse(
      res,
      DriverPasswordStatusCode.BAD_REQUEST,
      DriverPasswordMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const existingPassword = await pool.query(
      `SELECT * FROM driver_passwords WHERE driver_id = $1`,
      [driver_id]
    );

    if (existingPassword.rows.length > 0) {
      return errorResponse(
        res,
        DriverPasswordStatusCode.CONFLICT,
        DriverPasswordMessages.PASSWORD_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const result = await pool.query(
      `INSERT INTO driver_passwords (driver_id, password) 
       VALUES ($1, $2) RETURNING *`,
      [driver_id, hashedPassword]
    );

    const newDriverPassword = result.rows[0];
    successResponse(
      res,
      DriverPasswordStatusCode.CREATED,
      DriverPasswordMessages.PASSWORD_CREATED,
      newDriverPassword
    );
  } catch (error) {
    errorResponse(
      res,
      DriverPasswordStatusCode.INTERNAL_SERVER_ERROR,
      DriverPasswordMessages.ERROR_CREATING_PASSWORD,
      error.message
    );
  }
};

// GET DRIVER PASSWORD BY DRIVER_ID
export const getDriverPasswordByDriverId = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM driver_passwords WHERE driver_id = $1`,
      [driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverPasswordStatusCode.NOT_FOUND,
        DriverPasswordMessages.PASSWORD_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverPasswordStatusCode.SUCCESS,
      DriverPasswordMessages.PASSWORD_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverPasswordStatusCode.INTERNAL_SERVER_ERROR,
      DriverPasswordMessages.ERROR_FETCHING_PASSWORD,
      error.message
    );
  }
};

// UPDATE DRIVER PASSWORD
export const updateDriverPassword = async (req, res) => {
  const { driver_id } = req.params;
  const { password } = req.body;

  if (!password) {
    return errorResponse(
      res,
      DriverPasswordStatusCode.BAD_REQUEST,
      DriverPasswordMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `UPDATE driver_passwords SET password = $1 
       WHERE driver_id = $2 RETURNING *`,
      [hashedPassword, driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverPasswordStatusCode.NOT_FOUND,
        DriverPasswordMessages.PASSWORD_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverPasswordStatusCode.SUCCESS,
      DriverPasswordMessages.PASSWORD_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverPasswordStatusCode.INTERNAL_SERVER_ERROR,
      DriverPasswordMessages.ERROR_UPDATING_PASSWORD,
      error.message
    );
  }
};

// DELETE DRIVER PASSWORD
export const deleteDriverPassword = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM driver_passwords WHERE driver_id = $1 RETURNING *`,
      [driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverPasswordStatusCode.NOT_FOUND,
        DriverPasswordMessages.PASSWORD_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverPasswordStatusCode.SUCCESS,
      DriverPasswordMessages.PASSWORD_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverPasswordStatusCode.INTERNAL_SERVER_ERROR,
      DriverPasswordMessages.ERROR_DELETING_PASSWORD,
      error.message
    );
  }
};

// GET ALL DRIVER PASSWORDS
export const getAllDriverPasswords = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM driver_passwords`);
    const driverPasswords = result.rows;

    if (driverPasswords.length === 0) {
      return errorResponse(
        res,
        DriverPasswordStatusCode.NOT_FOUND,
        DriverPasswordMessages.PASSWORD_NOT_FOUND
      );
    }

    return successResponse(
      res,
      DriverPasswordStatusCode.SUCCESS,
      DriverPasswordMessages.PASSWORDS_FETCHED,
      driverPasswords
    );
  } catch (error) {
    return errorResponse(
      res,
      DriverPasswordStatusCode.INTERNAL_SERVER_ERROR,
      DriverPasswordMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};


