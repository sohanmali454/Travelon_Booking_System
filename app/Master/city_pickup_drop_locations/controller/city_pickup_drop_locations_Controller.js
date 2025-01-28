import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { CityPickupDropMessages } from "../utils/messages.js";
import { CityPickupDropStatusCode } from "../utils/statusCode.js";

// CREATE PICKUP DROP LOCATION
export const createPickupDropLocation = async (req, res) => {
  const {
    city_id,
    address,
    pincode,
    latitude,
    longitude,
    landmark,
    status = 1,
  } = req.body;

  if (!city_id || !address) {
    return errorResponse(
      res,
      CityPickupDropStatusCode.BAD_REQUEST,
      CityPickupDropMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO city_pickup_drop_locations 
        (city_id, address, pincode, latitude, longitude, landmark,status) 
        VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`,
      [city_id, address, pincode, latitude, longitude, landmark, status]
    );

    successResponse(
      res,
      CityPickupDropStatusCode.CREATED,
      CityPickupDropMessages.PICKUP_DROP_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_CREATING_PICKUP_DROP,
      error.message
    );
  }
};

// GET PICKUP DROP LOCATION BY ID
export const getPickupDropLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM city_pickup_drop_locations WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROP_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_FETCHING_PICKUP_DROP,
      error.message
    );
  }
};

// UPDATE PICKUP DROP LOCATION
export const updatePickupDropLocation = async (req, res) => {
  const { id } = req.params;
  const { city_id, address, pincode, latitude, longitude, landmark } = req.body;

  try {
    const result = await pool.query(
      `UPDATE city_pickup_drop_locations 
        SET city_id = $1, address = $2, pincode = $3, latitude = $4, longitude = $5, landmark = $6, 
         updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
      [city_id, address, pincode, latitude, longitude, landmark, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROP_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_UPDATING_PICKUP_DROP,
      error.message
    );
  }
};

// DELETE PICKUP DROP LOCATION
export const deletePickupDropLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM city_pickup_drop_locations WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROP_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_DELETING_PICKUP_DROP,
      error.message
    );
  }
};

// GET ALL PICKUP DROP LOCATIONS
export const getAllPickupDropLocations = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM city_pickup_drop_locations`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }

    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROPS_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_FETCHING_PICKUP_DROPS,
      error.message
    );
  }
};

// CREATE PICKUP LOCATION
export const createPickUpAndDropLocation = async (req, res) => {
  const { city_id, address, status } = req.body;

  if (!city_id || !address || !status) {
    return errorResponse(
      res,
      CityPickupDropStatusCode.BAD_REQUEST,
      CityPickupDropMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO city_pickup_drop_locations 
        (city_id, address, status) 
        VALUES ($1, $2, $3) RETURNING *`,
      [city_id, address, status]
    );

    successResponse(
      res,
      CityPickupDropStatusCode.CREATED,
      CityPickupDropMessages.PICKUP_DROP_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_CREATING_PICKUP_DROP,
      error.message
    );
  }
};

// DELETE PICKUP & DROP LOCATION
export const deletePickUpAndDropLocation = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return errorResponse(
      res,
      CityPickupDropStatusCode.BAD_REQUEST,
      CityPickupDropMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `DELETE FROM city_pickup_drop_locations WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }
    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROP_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_DELETING_PICKUP_DROP,
      error.message
    );
  }
};

// CREATE CITY AND PICKUP-DROP LOCATION
export const createCityAndPickupDropLocation = async (req, res) => {
  const {
    city_name,
    description,
    address,
    pincode,
    latitude,
    longitude,
    landmark,
    status = 1,
  } = req.body;

  if (!city_name || !description || !address) {
    return errorResponse(
      res,
      CityPickupDropStatusCode.BAD_REQUEST,
      CityPickupDropMessages.REQUIRED_FIELDS_MISSING
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cityResult = await client.query(
      `INSERT INTO cities_serviced (city_name, description) VALUES ($1, $2) RETURNING id`,
      [city_name, description]
    );
    const city_id = cityResult.rows[0].id;

    const locationResult = await client.query(
      `INSERT INTO city_pickup_drop_locations 
        (city_id, address, pincode, latitude, longitude, landmark, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [city_id, address, pincode, latitude, longitude, landmark, status]
    );

    await client.query("COMMIT");

    successResponse(
      res,
      CityPickupDropStatusCode.CREATED,
      CityPickupDropMessages.PICKUP_DROP_CREATED,
      {
        city: { id: city_id, city_name, description },
        location: locationResult.rows[0],
      }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_CREATING_PICKUP_DROP,
      error.message
    );
  } finally {
    client.release();
  }
};

//addCityWithMultipleAddresses
export const addCityWithMultipleAddresses = async (req, res) => {
  const { city_name, description, addresses } = req.body;
  console.log({ data: req.body });

  if (!city_name || !description || !addresses || !Array.isArray(addresses)) {
    return errorResponse(
      res,
      400,
      "Required fields are missing or invalid data. Please provide city_name, description, and a valid addresses array."
    );
  }

  try {
    const cityResult = await pool.query(
      `INSERT INTO cities_serviced (city_name, description) VALUES ($1, $2) RETURNING id`,
      [city_name, description]
    );

    const cityId = cityResult.rows[0].id;

    const addressQueries = addresses.map((address) => {
      const {
        address: addr,
        pincode,
        latitude,
        longitude,
        landmark,
        status = 1,
      } = address;

      if (!addr) {
        throw new Error(
          "Invalid address data. Each address must include address, pincode, latitude, longitude, landmark, and status."
        );
      }

      return pool.query(
        `INSERT INTO city_pickup_drop_locations 
        (city_id, address, pincode, latitude, longitude, landmark, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [cityId, addr, pincode, latitude, longitude, landmark, status]
      );
    });

    await Promise.all(addressQueries);

    successResponse(
      res,
      CityPickupDropStatusCode.CREATED,
      CityPickupDropMessages.PICKUP_DROP_CREATED
    );
  } catch (error) {
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_CREATING_PICKUP_DROP,
      error.message
    );
  }
};

export const getCityWithMultipleAddresses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        cities_serviced.city_name,
        cities_serviced.description,
        city_pickup_drop_locations.address,
        city_pickup_drop_locations.pincode,
        city_pickup_drop_locations.landmark,
        city_pickup_drop_locations.latitude,
        city_pickup_drop_locations.longitude,
        city_pickup_drop_locations.status
      FROM 
        cities_serviced
      JOIN 
        city_pickup_drop_locations 
      ON 
        cities_serviced.id = city_pickup_drop_locations.city_id
      WHERE 
        cities_serviced.status = 1`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        CityPickupDropStatusCode.NOT_FOUND,
        CityPickupDropMessages.PICKUP_DROP_NOT_FOUND
      );
    }

    const cityData = {
      city_name: result.rows[0].city_name,
      description: result.rows[0].description,
      addresses: result.rows.map((row) => ({
        address: row.address,
        pincode: row.pincode,
        latitude: row.latitude,
        longitude: row.longitude,
        landmark: row.landmark,
        status: row.status,
      })),
    };

    successResponse(
      res,
      CityPickupDropStatusCode.SUCCESS,
      CityPickupDropMessages.PICKUP_DROPS_FETCHED,
      cityData
    );
  } catch (error) {
    console.error("Database Query Error:", error.message);
    errorResponse(
      res,
      CityPickupDropStatusCode.INTERNAL_SERVER_ERROR,
      CityPickupDropMessages.ERROR_FETCHING_PICKUP_DROPS,
      error.message || "An unexpected error occurred"
    );
  }
};
