import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { UsersMessages } from "../utils/messages.js";
import { UsersStatusCode } from "../utils/statusCode.js";

// CREATE USER
export const createUser = async (req, res) => {
  const {
    user_name,
    gender,
    dob,
    mobile_number,
    alternate_contact_number,
    email,
    image_url,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (user_name, gender, dob, mobile_number, alternate_contact_number, email, image_url, verification_status, status, is_deleted) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        user_name,
        gender,
        dob,
        mobile_number,
        alternate_contact_number,
        email,
        image_url,
      ]
    );

    return successResponse(
      res,
      UsersStatusCode.CREATED,
      UsersMessages.USER_CREATED,
      result.rows[0]
    );
  } catch (error) {
    return errorResponse(
      res,
      UsersStatusCode.INTERNAL_SERVER_ERROR,
      UsersMessages.ERROR_CREATING_USER,
      error.message
    );
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, user_name, gender, dob, mobile_number, alternate_contact_number, email, image_url, verification_status, status, is_deleted 
       FROM users WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        UsersStatusCode.NOT_FOUND,
        UsersMessages.USER_NOT_FOUND
      );
    }

    successResponse(
      res,
      UsersStatusCode.SUCCESS,
      UsersMessages.USER_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      UsersStatusCode.INTERNAL_SERVER_ERROR,
      UsersMessages.ERROR_FETCHING_USER,
      error.message
    );
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_name, gender, dob, mobile_number, alternate_contact_number, email, image_url, verification_status, status,
       FROM users WHERE is_deleted = FALSE`
    );
    const users = result.rows;

    if (users.length === 0) {
      return errorResponse(
        res,
        UsersStatusCode.NOT_FOUND,
        UsersMessages.USER_NOT_FOUND
      );
    }

    return successResponse(
      res,
      UsersStatusCode.SUCCESS,
      UsersMessages.USERS_FETCHED,
      users
    );
  } catch (error) {
    return errorResponse(
      res,
      UsersStatusCode.INTERNAL_SERVER_ERROR,
      UsersMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    user_name,
    gender,
    dob,
    mobile_number,
    alternate_contact_number,
    email,
    image_url,
    verification_status,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET user_name = $1, gender = $2, dob = $3, mobile_number = $4, alternate_contact_number = $5, email = $6, 
           image_url = $7, verification_status = $8, status = $9, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $10 AND is_deleted = FALSE RETURNING *`,
      [
        user_name,
        gender,
        dob,
        mobile_number,
        alternate_contact_number,
        email,
        image_url,
        verification_status,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        UsersStatusCode.NOT_FOUND,
        UsersMessages.USER_NOT_FOUND
      );
    }

    successResponse(
      res,
      UsersStatusCode.SUCCESS,
      UsersMessages.USER_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      UsersStatusCode.INTERNAL_SERVER_ERROR,
      UsersMessages.ERROR_UPDATING_USER,
      error.message
    );
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users SET is_deleted = TRUE WHERE id = $1 AND is_deleted = FALSE RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        UsersStatusCode.NOT_FOUND,
        UsersMessages.USER_NOT_FOUND
      );
    }

    successResponse(
      res,
      UsersStatusCode.SUCCESS,
      UsersMessages.USER_SOFT_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      UsersStatusCode.INTERNAL_SERVER_ERROR,
      UsersMessages.ERROR_DELETING_USER,
      error.message
    );
  }
};


