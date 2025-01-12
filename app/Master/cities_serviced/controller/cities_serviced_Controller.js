import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { CitiesMessages } from "../utils/messages.js";
import { CitiesStatusCode } from "../utils/statusCode.js";

// CREATE CITY
export const createCity = async (req, res) => {
  const { city_name, description, status } = req.body;

  if (!city_name) {
    return errorResponse(
      res,
      CitiesStatusCode.BAD_REQUEST,
      CitiesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO cities_serviced (city_name, description, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [city_name, description, status]
    );

    successResponse(
      res,
      CitiesStatusCode.CREATED,
      CitiesMessages.CITY_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CitiesStatusCode.INTERNAL_SERVER_ERROR,
      CitiesMessages.ERROR_CREATING_CITY,
      error.message
    );
  }
};

// GET CITY BY ID
export const getCityById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM cities_serviced WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CitiesStatusCode.NOT_FOUND,
        CitiesMessages.CITY_NOT_FOUND
      );
    }

    successResponse(
      res,
      CitiesStatusCode.SUCCESS,
      CitiesMessages.CITY_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CitiesStatusCode.INTERNAL_SERVER_ERROR,
      CitiesMessages.ERROR_FETCHING_CITY,
      error.message
    );
  }
};

// UPDATE CITY
export const updateCity = async (req, res) => {
  const { id } = req.params;
  const { city_name, description, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cities_serviced SET city_name = $1, description = $2, status = $3, 
       updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [city_name, description, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CitiesStatusCode.NOT_FOUND,
        CitiesMessages.CITY_NOT_FOUND
      );
    }

    successResponse(
      res,
      CitiesStatusCode.SUCCESS,
      CitiesMessages.CITY_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CitiesStatusCode.INTERNAL_SERVER_ERROR,
      CitiesMessages.ERROR_UPDATING_CITY,
      error.message
    );
  }
};

// DELETE CITY
export const deleteCity = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM cities_serviced WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CitiesStatusCode.NOT_FOUND,
        CitiesMessages.CITY_NOT_FOUND
      );
    }

    successResponse(
      res,
      CitiesStatusCode.SUCCESS,
      CitiesMessages.CITY_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CitiesStatusCode.INTERNAL_SERVER_ERROR,
      CitiesMessages.ERROR_DELETING_CITY,
      error.message
    );
  }
};

// GET ALL CITIES
export const getAllCities = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM cities_serviced`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CitiesStatusCode.NOT_FOUND,
        CitiesMessages.CITY_NOT_FOUND
      );
    }

    successResponse(
      res,
      CitiesStatusCode.SUCCESS,
      CitiesMessages.CITIES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CitiesStatusCode.INTERNAL_SERVER_ERROR,
      CitiesMessages.ERROR_FETCHING_CITIES,
      error.message
    );
  }
};
