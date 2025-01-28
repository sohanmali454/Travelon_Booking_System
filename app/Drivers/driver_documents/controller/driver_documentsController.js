import fs from "fs";
import multer from "multer";
import path from "path";
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { DriverDocumentsMessages } from "../utils/messages.js";
import { DriverDocumentsStatusCode } from "../utils/statusCode.js";

// CONFIGURE MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const driverId = req.body.driver_id;

    if (!driverId) {
      return cb(new Error("Driver ID is required"));
    }

    const uploadPath = `./uploads/files/Drivers/${driverId}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split("/")[1];
    const fileName = `driver_${req.body.driver_id}_${uniqueSuffix}.${extension}`;
    cb(null, fileName);
  },
});

// MULTER SETUP
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
    }
  },
});

// CREATE AND UPLOAD DRIVER DOCUMENT
export const createAndUploadDriverDocument = [
  upload.fields([{ name: "document_url", maxCount: 10 }]),

  async (req, res) => {
    const { driver_id, document_type, status } = req.body;

    if (!req.files || !req.files.document_url) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.BAD_REQUEST,
        DriverDocumentsMessages.NO_FILE_UPLOADED
      );
    }

    if (!driver_id || !document_type) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.BAD_REQUEST,
        DriverDocumentsMessages.REQUIRED_FIELDS_MISSING
      );
    }

    try {
      const filesData = req.files.document_url.map((file) => {
        const document_url = `E:/Travelon Booking System/${file.path.replace(
          /\\/g,
          "/"
        )}`;
        return pool.query(
          `INSERT INTO driver_documents (driver_id, document_type, document_url, status) 
          VALUES ($1, $2, $3, $4) RETURNING *`,
          [driver_id, document_type, document_url, status]
        );
      });

      const results = await Promise.all(filesData);
      return successResponse(
        res,
        DriverDocumentsStatusCode.CREATED,
        DriverDocumentsMessages.DOCUMENT_CREATED,
        results.map((result) => result.rows[0])
      );
    } catch (error) {
      console.error("Error uploading and creating driver document:", error);
      return errorResponse(
        res,
        DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
        DriverDocumentsMessages.ERROR_CREATING_DOCUMENT,
        error.message
      );
    }
  },
];

// GET DRIVER DOCUMENT ID
export const getDriverDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(id);

    const result = await pool.query(
      `SELECT document_url FROM driver_documents WHERE id = $1 AND is_deleted = false`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.NOT_FOUND,
        DriverDocumentsMessages.DOCUMENT_NOT_FOUND
      );
    }

    const documentsWithFullPath = result.rows.map((document) => {
      return {
        ...document,
        document_url: `${document.document_url}`,
      };
    });

    successResponse(
      res,
      DriverDocumentsStatusCode.SUCCESS,
      DriverDocumentsMessages.DOCUMENT_RETRIEVED,
      documentsWithFullPath
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

//SOFT DELETE DRIVER DOCUMENT ID
export const deleteDriverDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE driver_documents 
      SET is_deleted = TRUE WHERE id = $1  RETURNING *`,
      [id]
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

// UPDATE DRIVER DOCUMENT
export const updateDriverDocument = [
  upload.single("document_url"),
  async (req, res) => {
    const { id } = req.params;
    const { driver_id, status, document_type } = req.body;

    if (!driver_id|| !document_type) {
      return errorResponse(
        res,
        DriverDocumentsStatusCode.BAD_REQUEST,
        DriverDocumentsMessages.REQUIRED_FIELDS_MISSING
      );
    }

    try {
      const existingDocument = await pool.query(
        `SELECT document_url FROM driver_documents WHERE id = $1 AND is_deleted = FALSE`,
        [id]
      );

      if (existingDocument.rows.length === 0) {
        return errorResponse(
          res,
          DriverDocumentsStatusCode.NOT_FOUND,
          DriverDocumentsMessages.PICTURE_NOT_FOUND
        );
      }

      const oldDocumentUrl = existingDocument.rows[0].document_url;

      if (req.file) {
        const newDocumentUrl = `E:/Travelon Booking System/${req.file.path.replace(
          /\\/g,
          "/"
        )}`;

        const updatedResult = await pool.query(
          `UPDATE driver_documents SET driver_id = $1, document_type = $2, document_url = $3, status = $4 WHERE id = $5 RETURNING *`,
          [driver_id, document_type, newDocumentUrl, status, id]
        );

        const oldDocumentPath = path.resolve(oldDocumentUrl);
        try {
          if (fs.existsSync(oldDocumentPath)) {
            fs.unlinkSync(oldDocumentPath);
          }
        } catch (error) {
          console.error("Error deleting old document:", error);
        }

        return successResponse(
          res,
          DriverDocumentsStatusCode.SUCCESS,
          DriverDocumentsMessages.DOCUMENT_UPDATED,
          updatedResult.rows[0]
        );
      } else {
        const updatedResult = await pool.query(
          `UPDATE driver_documents SET driver_id = $1, document_type = $2, status = $3 WHERE id = $4 RETURNING *`,
          [driver_id, document_type, status, id]
        );

        return successResponse(
          res,
          DriverDocumentsStatusCode.SUCCESS,
          DriverDocumentsMessages.DOCUMENT_UPDATED,
          updatedResult.rows[0]
        );
      }
    } catch (error) {
      console.error("Error updating driver document:", error);
      return errorResponse(
        res,
        DriverDocumentsStatusCode.INTERNAL_SERVER_ERROR,
        DriverDocumentsMessages.ERROR_UPDATING_DOCUMENT,
        error.message
      );
    }
  },
];


// GET ALL DRIVER DOCUMENTS
export const getAllDriverDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM driver_documents WHERE is_deleted = false`
    );
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
