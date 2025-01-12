import { pool } from "../../../../config/database/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { StatusCode } from "../utils/statusCode.js";
import { Messages } from "../utils/messages.js";

// SIGN IN
export const sign_in = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(
      res,
      StatusCode.BAD_REQUEST,
      Messages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(`SELECT * FROM admins WHERE email = $1`, [
      email,
    ]);

    const admin = result.rows[0];

    if (!admin) {
      return errorResponse(res, StatusCode.NOT_FOUND, Messages.ADMIN_NOT_FOUND);
    }

    const isPasswordValid = bcryptjs.compareSync(password, admin.password);

    if (!isPasswordValid) {
      return errorResponse(
        res,
        StatusCode.UNAUTHORIZED,
        Messages.INVALID_PASSWORD
      );
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);

    res.cookie("access_token", token, { httpOnly: true });
    successResponse(res, StatusCode.OK, Messages.LOGIN_SUCCESSFUL, {
      id: admin.id,
      user_name: admin.user_name,
      email: admin.email,
    });
  } catch (error) {
    errorResponse(
      res,
      StatusCode.INTERNAL_SERVER_ERROR,
      Messages.LOGIN_ERROR,
      error.message
    );
  }
};

// SIGN OUT
export const sign_out = async (req, res) => {
  try {
    res.clearCookie("access_token");
    successResponse(res, StatusCode.OK, Messages.LOGOUT_SUCCESSFUL);
  } catch (error) {
    errorResponse(
      res,
      StatusCode.INTERNAL_SERVER_ERROR,
      Messages.LOGOUT_ERROR,
      error.message
    );
  }
};
