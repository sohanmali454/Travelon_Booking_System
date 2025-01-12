import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { DriverDocumentsMessages } from "../utils/messages.js";
import { DriverDocumentsStatusCode } from "../utils/statusCode.js";

// CREATE DRIVER DOCUMENT
export const createDriverDocument = async (req, res) => {
  const { driver_id, document_type, document_url, status } = req.body;

  if (!driver_id || !document_type || !document_url) {
    return errorResponse(
      res,
      DriverDocumentsStatusCode.BAD_REQUEST,
      DriverDocumentsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const existingDocument = await pool.query(
      `SELECT * FROM driver_documents WHERE driver_id = $1 AND document_type = $2`,
      [driver_id, document_type]
    );

    if (existingDocument.rows.length > 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.CONFLICT,
        DriverDocumentsMessages.DOCUMENT_ALREADY_EXISTS
      );
    }

    const result = await pool.query(
      `INSERT INTO driver_documents (driver_id, document_type, document_url, status) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [driver_id, document_type, document_url, status]
    );

    const newDriverDocument = result.rows[0];
    successResponse(
      res,
      DriverDocumentsStatusCode.CREATED,
      DriverDocumentsMessages.DOCUMENT_CREATED,
      newDriverDocument
    );
  } catch (error) {
    errorResponse(
      res,
      DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
      DriverDocumentsMessages.ERROR_CREATING_DOCUMENT,
      error.message
    );
  }
};

// GET DRIVER DOCUMENT BY DRIVER_ID
export const getDriverDocumentByDriverId = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM driver_documents WHERE driver_id = $1`,
      [driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.NOT_FOUND,
        DriverDocumentsMessages.DOCUMENT_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverDocumentsStatusCode.SUCCESS,
      DriverDocumentsMessages.DOCUMENT_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
      DriverDocumentsMessages.ERROR_FETCHING_DOCUMENT,
      error.message
    );
  }
};

// UPDATE DRIVER DOCUMENT
export const updateDriverDocument = async (req, res) => {
  const { driver_id } = req.params;
  const { document_type, document_url, status } = req.body;

  if (!document_type || !document_url) {
    return errorResponse(
      res,
      DriverDocumentsStatusCode.BAD_REQUEST,
      DriverDocumentsMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `UPDATE driver_documents SET document_type = $1, 
       document_url = $2, status = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE driver_id = $4 RETURNING *`,
      [document_type, document_url, status, driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.NOT_FOUND,
        DriverDocumentsMessages.DOCUMENT_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverDocumentsStatusCode.SUCCESS,
      DriverDocumentsMessages.DOCUMENT_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
      DriverDocumentsMessages.ERROR_UPDATING_DOCUMENT,
      error.message
    );
  }
};

// DELETE DRIVER DOCUMENT
export const deleteDriverDocument = async (req, res) => {
  const { driver_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM driver_documents WHERE driver_id = $1 RETURNING *`,
      [driver_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.NOT_FOUND,
        DriverDocumentsMessages.DOCUMENT_NOT_FOUND
      );
    }

    successResponse(
      res,
      DriverDocumentsStatusCode.SUCCESS,
      DriverDocumentsMessages.DOCUMENT_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
      DriverDocumentsMessages.ERROR_DELETING_DOCUMENT,
      error.message
    );
  }
};

// GET ALL DRIVER DOCUMENTS
export const getAllDriverDocuments = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM driver_documents`);
    const driverDocuments = result.rows;

    if (driverDocuments.length === 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.NOT_FOUND,
        DriverDocumentsMessages.DOCUMENT_NOT_FOUND
      );
    }

    return successResponse(
      res,
      DriverDocumentsStatusCode.SUCCESS,
      DriverDocumentsMessages.DOCUMENTS_FETCHED,
      driverDocuments
    );
  } catch (error) {
    return errorResponse(
      res,
      DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
      DriverDocumentsMessages.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

