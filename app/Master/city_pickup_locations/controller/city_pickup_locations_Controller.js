import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { CityPickupLocationsMessages } from "../utils/messages.js";
import { CityPickupLocationsStatusCode } from "../utils/statusCode.js";

// ✅ CREATE PICKUP LOCATION
export const createPickupLocation = async (req, res) => {
  const { city_id, address, pincode, latitude, longitude, landmark, status } =
    req.body;

  if (!city_id || !address) {
    return errorResponse(
      res,
      CityPickupLocationsStatusCode.BAD_REQUEST,
      CityPickupLocationsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const cityCheckQuery = `SELECT id FROM cities_serviced WHERE id = $1;`;
    const cityCheckResult = await pool.query(cityCheckQuery, [city_id]);

    if (cityCheckResult.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.BAD_REQUEST,
        CityPickupLocationsMessages.INVALID_CITY_ID
      );
    }

    const query = `
      INSERT INTO city_pickup_locations (city_id, address, pincode, latitude, longitude, landmark, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      city_id,
      address,
      pincode,
      latitude,
      longitude,
      landmark,
      status,
    ];

    const result = await pool.query(query, values);

    successResponse(
      res,
      CityPickupLocationsStatusCode.CREATED,
      CityPickupLocationsMessages.LOCATION_CREATED,
      result.rows[0]
    );
  } catch (error) {
    if (error.message.includes("violates foreign key constraint")) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.BAD_REQUEST,
        CityPickupLocationsMessages.FOREGIN_KEY_CONSTRAINTS_ERROR
      );
    }

    errorResponse(
      res,
      CityPickupLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupLocationsMessages.ERROR_CREATING_LOCATION,
      error.message
    );
  }
};

// ✅ GET ALL PICKUP LOCATIONS
export const getAllPickupLocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM city_pickup_locations ORDER BY id ASC;`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.NOT_FOUND,
        CityPickupLocationsMessages.NO_LOCATIONS_FOUND
      );
    }

    successResponse(
      res,
      CityPickupLocationsStatusCode.SUCCESS,
      CityPickupLocationsMessages.LOCATIONS_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupLocationsMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// ✅ GET PICKUP LOCATIONS BY city_id
export const getPickupLocationsByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM city_pickup_locations WHERE city_id = $1 ORDER BY id ASC;`,
      [city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.NOT_FOUND,
        CityPickupLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupLocationsStatusCode.SUCCESS,
      CityPickupLocationsMessages.LOCATIONS_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupLocationsMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// ✅ UPDATE PICKUP LOCATION BY city_id
export const updatePickupLocationByCityId = async (req, res) => {
  const { city_id } = req.params;
  const { address, pincode, latitude, longitude, landmark, status } = req.body;

  if (!address) {
    return errorResponse(
      res,
      CityPickupLocationsStatusCode.BAD_REQUEST,
      CityPickupLocationsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const query = `
      UPDATE city_pickup_locations
      SET address = $1, pincode = $2, latitude = $3, longitude = $4, landmark = $5, status = $6
      WHERE city_id = $7
      RETURNING *;
    `;
    const values = [
      address,
      pincode,
      latitude,
      longitude,
      landmark,
      status,
      city_id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.NOT_FOUND,
        CityPickupLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupLocationsStatusCode.SUCCESS,
      CityPickupLocationsMessages.LOCATION_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupLocationsMessages.ERROR_UPDATING_LOCATION,
      error.message
    );
  }
};

// ✅ DELETE PICKUP LOCATION BY city_id
export const deletePickupLocationByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM city_pickup_locations WHERE city_id = $1 RETURNING *;`,
      [city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupLocationsStatusCode.NOT_FOUND,
        CityPickupLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupLocationsStatusCode.SUCCESS,
      CityPickupLocationsMessages.LOCATION_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupLocationsMessages.ERROR_DELETING_LOCATION,
      error.message
    );
  }
};
