// --- vehiclePictures_Controller.js ---
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { VehiclePicturesMessages } from "../utils/messages.js";
import { VehiclePicturesStatusCode } from "../utils/statusCode.js";

// CREATE VEHICLE PICTURE
export const createVehiclePicture = async (req, res) => {
  const { vehicle_id, image_url, status } = req.body;

  if (!vehicle_id || !image_url) {
    return errorResponse(
      res,
      VehiclePicturesStatusCode.BAD_REQUEST,
      VehiclePicturesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const existingPicture = await pool.query(
      `SELECT * FROM vehicle_pictures WHERE vehicle_id = $1`,
      [vehicle_id]
    );

    if (existingPicture.rows.length > 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.BAD_REQUEST,
        VehiclePicturesMessages.PICTURE_ALREADY_EXISTS
      );
    }

    const result = await pool.query(
      `INSERT INTO vehicle_pictures (vehicle_id, image_url, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [vehicle_id, image_url, status]
    );

    successResponse(
      res,
      VehiclePicturesStatusCode.CREATED,
      VehiclePicturesMessages.PICTURE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_CREATING_PICTURE,
      error.message
    );
  }
};

// GET ALL VEHICLE PICTURES
export const getAllVehiclePictures = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicle_pictures`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURES_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclePicturesStatusCode.SUCCESS,
      VehiclePicturesMessages.PICTURES_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_FETCHING_PICTURES,
      error.message
    );
  }
};

// GET VEHICLE PICTURE BY ID
export const getVehiclePictureById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM vehicle_pictures WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclePicturesStatusCode.SUCCESS,
      VehiclePicturesMessages.PICTURE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_FETCHING_PICTURE,
      error.message
    );
  }
};

// UPDATE VEHICLE PICTURE
export const updateVehiclePicture = async (req, res) => {
  const { id } = req.params;
  const { vehicle_id, image_url, status } = req.body;

  if (!vehicle_id || !image_url) {
    return errorResponse(
      res,
      VehiclePicturesStatusCode.BAD_REQUEST,
      VehiclePicturesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE vehicle_pictures SET vehicle_id = $1, image_url = $2, status = $3 WHERE id = $4 RETURNING *`,
      [vehicle_id, image_url, status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclePicturesStatusCode.SUCCESS,
      VehiclePicturesMessages.PICTURE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_UPDATING_PICTURE,
      error.message
    );
  }
};

// DELETE VEHICLE PICTURE
export const deleteVehiclePicture = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM vehicle_pictures WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURE_NOT_FOUND
      );
    }

    successResponse(
      res,
      VehiclePicturesStatusCode.SUCCESS,
      VehiclePicturesMessages.PICTURE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_DELETING_PICTURE,
      error.message
    );
  }
};
