import jwt from "jsonwebtoken";
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { DriverAppTokensMessages } from "../utils/messages.js";
import { DriverAppTokensStatusCode } from "../utils/statusCode.js";

// CREATE DRIVER APP TOKEN
export const createDriverAppToken = async (req, res) => {
  const { driver_id } = req.body;

  if (!driver_id) {
    return errorResponse(
      res,
      DriverAppTokensStatusCode.BAD_REQUEST,
      DriverAppTokensMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const existingToken = await pool.query(
      `SELECT * FROM driver_app_tokens WHERE driver_id = $1`,
      [driver_id]
    );

    if (existingToken.rows.length > 0) {
      return errorResponse(
        res,
        DriverAppTokensStatusCode.CONFLICT,
        DriverAppTokensMessages.TOKEN_ALREADY_EXISTS
      );
    }

    const app_token = jwt.sign({ driver_id }, process.env.JWT_SECRET);

    const result = await pool.query(
      `INSERT INTO driver_app_tokens (driver_id, app_token) 
       VALUES ($1, $2) RETURNING *`,
      [driver_id, app_token]
    );

    const newDriverAppToken = result.rows[0];

    res.cookie("app_token", app_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    successResponse(
      res,
      DriverAppTokensStatusCode.CREATED,
      DriverAppTokensMessages.TOKEN_CREATED,
      newDriverAppToken
    );
  } catch (error) {
    errorResponse(
      res,
      DriverAppTokensStatusCode.INTERNAL_SERVER_ERROR,
      DriverAppTokensMessages.ERROR_CREATING_TOKEN,
      error.message
    );
  }
};

// GET ALL DRIVER APP TOKENS
export const getAllDriverAppTokens = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM driver_app_tokens");
    const driverAppTokens = result.rows;

    if (driverAppTokens.length === 0) {
      return errorResponse(
        res,
        DriverAppTokensStatusCode.NOT_FOUND,
        DriverAppTokensMessages.TOKEN_NOT_FOUND
      );
    }

    return successResponse(
      res,
      DriverAppTokensStatusCode.SUCCESS,
      DriverAppTokensMessages.TOKENS_FETCHED,
      driverAppTokens
    );
  } catch (error) {
    return errorResponse(
      res,
      DriverAppTokensStatusCode.INTERNAL_SERVER_ERROR,
      DriverAppTokensMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// GET DRIVER APP TOKEN BY  ID
export const getDriverAppTokenById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM driver_app_tokens WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverAppTokensStatusCode.NOT_FOUND,
        DriverAppTokensMessages.TOKEN_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverAppTokensStatusCode.SUCCESS,
      DriverAppTokensMessages.TOKEN_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverAppTokensStatusCode.INTERNAL_SERVER_ERROR,
      DriverAppTokensMessages.ERROR_FETCHING_TOKEN,
      error.message
    );
  }
};

// DELETE DRIVER APP TOKEN
export const deleteDriverAppToken = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM driver_app_tokens WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverAppTokensStatusCode.NOT_FOUND,
        DriverAppTokensMessages.TOKEN_NOT_FOUND
      );
    }

    res.clearCookie("app_token");

    successResponse(
      res,
      DriverAppTokensStatusCode.SUCCESS,
      DriverAppTokensMessages.TOKEN_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverAppTokensStatusCode.INTERNAL_SERVER_ERROR,
      DriverAppTokensMessages.ERROR_DELETING_TOKEN,
      error.message
    );
  }
};
