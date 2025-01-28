import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { VehiclePicturesMessages } from "../utils/messages.js";
import { VehiclePicturesStatusCode } from "../utils/statusCode.js";

// CONFIGURE MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleId = req.body.vehicle_id;

    if (!vehicleId) {
      return cb(new Error("Vehicle ID is required"));
    }
    const uploadPath = `./uploads/files/Vehicles/${vehicleId}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split("/")[1];
    const fileName = `vehicle_${req.body.vehicle_id}_${uniqueSuffix}.${extension}`;
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

// CREATE AND UPLOAD MULTIPLE VEHICLE PICTURES
export const createAndUploadVehiclePicture = [
  upload.fields([{ name: "image_url", maxCount: 10 }]),
  async (req, res) => {
    const { vehicle_id, status } = req.body;
    if (!vehicle_id) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.BAD_REQUEST,
        VehiclePicturesMessages.REQUIRED_FIELDS_MISSING
      );
    }

    if (!req.files || !req.files.image_url) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.BAD_REQUEST,
        VehiclePicturesMessages.NO_FILE_UPLOADED
      );
    }

    try {
      const filesData = req.files.image_url.map((file) => {
        const image_url = `E:/Travelon Booking System/${file.path.replace(
          /\\/g,
          "/"
        )}`;
        return pool.query(
          `INSERT INTO vehicle_pictures (vehicle_id, image_url, status) 
           VALUES ($1, $2, $3) RETURNING *`,
          [vehicle_id, image_url, status]
        );
      });

      const results = await Promise.all(filesData);

      return successResponse(
        res,
        VehiclePicturesStatusCode.CREATED,
        VehiclePicturesMessages.DOCUMENT_CREATED,
        results.map((result) => result.rows[0])
      );
    } catch (error) {
      console.error("Error uploading and creating vehicle picture:", error);
      return errorResponse(
        res,
        VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
        VehiclePicturesMessages.ERROR_CREATING_DOCUMENT,
        error.message
      );
    }
  },
];

// UPDATE VEHICLE PICTURE
export const updateVehiclePicture = [
  upload.single("image_url"),
  async (req, res) => {
    const { id } = req.params;
    const { vehicle_id, status } = req.body;

    if (!vehicle_id || !id) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.BAD_REQUEST,
        VehiclePicturesMessages.REQUIRED_FIELDS_MISSING
      );
    }
    try {
      const existingPicture = await pool.query(
        `SELECT image_url FROM vehicle_pictures WHERE id = $1 AND is_deleted = FALSE`,
        [id]
      );

      if (existingPicture.rows.length === 0) {
        return errorResponse(
          res,
          VehiclePicturesStatusCode.NOT_FOUND,
          VehiclePicturesMessages.PICTURE_NOT_FOUND
        );
      }

      const oldImageUrl = existingPicture.rows[0].image_url;
      if (req.file) {
        const newImageUrl = `E:/Travelon Booking System/${req.file.path.replace(
          /\\/g,
          "/"
        )}`;

        const updatedResult = await pool.query(
          `UPDATE vehicle_pictures SET vehicle_id = $1, image_url = $2, status = $3 WHERE id = $4 RETURNING *`,
          [vehicle_id, newImageUrl, status, id]
        );

        const oldImagePath = path.resolve(oldImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        return successResponse(
          res,
          VehiclePicturesStatusCode.SUCCESS,
          VehiclePicturesMessages.PICTURE_UPDATED,
          updatedResult.rows[0]
        );
      } else {
        const updatedResult = await pool.query(
          `UPDATE vehicle_pictures SET vehicle_id = $1, status = $2 WHERE id = $3 RETURNING *`,
          [vehicle_id, status, id]
        );

        return successResponse(
          res,
          VehiclePicturesStatusCode.SUCCESS,
          VehiclePicturesMessages.PICTURE_UPDATED,
          updatedResult.rows[0]
        );
      }
    } catch (error) {
      console.error("Error updating vehicle picture:", error);
      return errorResponse(
        res,
        VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
        VehiclePicturesMessages.ERROR_UPDATING_PICTURE,
        error.message
      );
    }
  },
];

// SOFT DELETE VEHICLE PICTURE
export const deleteVehiclePicture = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE vehicle_pictures 
       SET is_deleted = TRUE WHERE id = $1 RETURNING *`,
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
    console.error("Error deleting vehicle picture:", error);
    return errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_DELETING_PICTURE,
      error.message
    );
  }
};

// GET ALL VEHICLE PICTURE

export const getAllVehiclePictures = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM vehicle_pictures WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURES_NOT_FOUND
      );
    }

    const picturesWithFullPath = result.rows.map((picture) => {
      return {
        ...picture,
        image_url: `${picture.image_url}`,
      };
    });

    successResponse(
      res,
      VehiclePicturesStatusCode.SUCCESS,
      VehiclePicturesMessages.PICTURES_RETRIEVED,
      picturesWithFullPath
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

/// GET VEHICLE PICTURE BY ID
export const getVehiclePictureById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT image_url FROM vehicle_pictures WHERE id = $1  AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURE_NOT_FOUND
      );
    }

    const imageUrl = result.rows[0].image_url;

    const imagePath = path.resolve(`E:/Travelon Booking System/`, imageUrl);

    if (!fs.existsSync(imagePath)) {
      return errorResponse(
        res,
        VehiclePicturesStatusCode.NOT_FOUND,
        VehiclePicturesMessages.PICTURE_NOT_FOUND
      );
    }
    res.sendFile(imagePath, (err) => {
      if (err) {
        return errorResponse(
          res,
          VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
          VehiclePicturesMessages.ERROR_FETCHING_PICTURE,
          err.message
        );
      }
    });
  } catch (error) {
    errorResponse(
      res,
      VehiclePicturesStatusCode.INTERNAL_SERVER_ERROR,
      VehiclePicturesMessages.ERROR_FETCHING_PICTURE,
      error.message
    );
  }
};
