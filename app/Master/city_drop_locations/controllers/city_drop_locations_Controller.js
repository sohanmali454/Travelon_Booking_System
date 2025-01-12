import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { CityDropLocationsMessages } from "../utils/messages.js";
import { CityDropLocationsStatusCode } from "../utils/statusCode.js";

// ✅ CREATE DROP LOCATION
export const createDropLocation = async (req, res) => {
  const { city_id, address, pincode, latitude, longitude, landmark, status } =
    req.body;

  if (!city_id || !address) {
    return errorResponse(
      res,
      CityDropLocationsStatusCode.BAD_REQUEST,
      CityDropLocationsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const cityCheckQuery = `SELECT id FROM cities_serviced WHERE id = $1;`;
    const cityCheckResult = await pool.query(cityCheckQuery, [city_id]);

    if (cityCheckResult.rows.length === 0) {
      return errorResponse(
        res,
        CityDropLocationsStatusCode.BAD_REQUEST,
        CityDropLocationsMessages.INVALID_CITY_ID
      );
    }

    const query = `
      INSERT INTO city_drop_locations (city_id, address, pincode, latitude, longitude, landmark, status)
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
      CityDropLocationsStatusCode.CREATED,
      CityDropLocationsMessages.LOCATION_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityDropLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityDropLocationsMessages.ERROR_CREATING_LOCATION,
      error.message
    );
  }
};

//GET ALL DROP LOCATIONS
export const getAllDropLocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM city_drop_locations ORDER BY id ASC;`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityDropLocationsStatusCode.NOT_FOUND,
        CityDropLocationsMessages.NO_LOCATIONS_FOUND
      );
    }

    successResponse(
      res,
      CityDropLocationsStatusCode.SUCCESS,
      CityDropLocationsMessages.LOCATIONS_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CityDropLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityDropLocationsMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// ✅ GET DROP LOCATIONS BY city_id
export const getDropLocationsByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM city_drop_locations WHERE city_id = $1 ORDER BY id ASC;`,
      [city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityDropLocationsStatusCode.NOT_FOUND,
        CityDropLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityDropLocationsStatusCode.SUCCESS,
      CityDropLocationsMessages.LOCATIONS_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CityDropLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityDropLocationsMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// ✅ UPDATE DROP LOCATION BY city_id
export const updateDropLocationByCityId = async (req, res) => {
  const { city_id } = req.params;
  const { address, pincode, latitude, longitude, landmark, status } = req.body;

  if (!address) {
    return errorResponse(
      res,
      CityDropLocationsStatusCode.BAD_REQUEST,
      CityDropLocationsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const query = `
      UPDATE city_drop_locations
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
        CityDropLocationsStatusCode.NOT_FOUND,
        CityDropLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityDropLocationsStatusCode.SUCCESS,
      CityDropLocationsMessages.LOCATION_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityDropLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityDropLocationsMessages.ERROR_UPDATING_LOCATION,
      error.message
    );
  }
};

// ✅ DELETE DROP LOCATION BY city_id
export const deleteDropLocationByCityId = async (req, res) => {
  const { city_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM city_drop_locations WHERE city_id = $1 RETURNING *;`,
      [city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityDropLocationsStatusCode.NOT_FOUND,
        CityDropLocationsMessages.LOCATION_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityDropLocationsStatusCode.SUCCESS,
      CityDropLocationsMessages.LOCATION_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityDropLocationsStatusCode.INTERNAL_SERVER_ERROR,
      CityDropLocationsMessages.ERROR_DELETING_LOCATION,
      error.message
    );
  }
};
