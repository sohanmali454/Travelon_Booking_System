import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RoutesMessages } from "../utils/messages.js";
import { RoutesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE SCHEDULE
export const createRouteSchedule = async (req, res) => {
  const {
    route_id,
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status,
  } = req.body;
  console.log("Incoming request body:", req.body);

  if (
    !route_id ||
    !title ||
    !departure_date_time ||
    !arrival_date_time ||
    !capacity
  ) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO route_schedules (route_id, title, departure_date_time, arrival_date_time, details, capacity, seats_available, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        route_id,
        title,
        departure_date_time,
        arrival_date_time,
        details,
        capacity,
        seats_available,
        status,
      ]
    );

    successResponse(
      res,
      RoutesStatusCode.CREATED,
      RoutesMessages.ROUTE_SCHEDULE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_CREATING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE
export const getAllRouteSchedules = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, route_id,
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status FROM route_schedules WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// GET ROUTE SCHEDULE BY ROUTE ID
export const getRouteScheduleByRouteId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id  route_id,
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status FROM route_schedules WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// UPDATE ROUTE SCHEDULE
export const updateRouteSchedule = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    departure_date_time,
    arrival_date_time,
    details,
    capacity,
    seats_available,
    status,
  } = req.body;
  console.log("Incoming request params & body:", [req.params], req.body);

  try {
    const result = await pool.query(
      `UPDATE route_schedules 
       SET title = $1, departure_date_time = $2, arrival_date_time = $3, details = $4, capacity = $5, seats_available = $6, status = $7 
       WHERE id = $8 RETURNING *`,
      [
        title,
        departure_date_time,
        arrival_date_time,
        details,
        capacity,
        seats_available,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_UPDATING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// SOFT DELETE ROUTE SCHEDULE BY ID
export const deleteRouteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE route_schedules 
       SET is_deleted = TRUE 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_DELETING_ROUTE_SCHEDULE,
      error.message
    );
  }
};

// GET ALL ROUTE SCHEDULE With CITY
export const getAllRouteSchedulesWithCity = async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
    route_schedules.id AS route_schedules_id,
    routes.title, 
    routes.source_city_id, 
    source_city.city_name AS source_city_name, 
    routes.destination_city_id, 
    destination_city.city_name AS destination_city_name, 
    routes.travel_time_in_hours, 
    route_schedules.title AS schedule_title, 
    route_schedules.departure_date_time, 
    route_schedules.arrival_date_time, 
    route_schedules.details, 
    route_schedules.capacity, 
    route_schedules.seats_available, 
    route_schedules.status,
    route_schedule_rates_per_seat.rate,
    route_schedule_rates_per_seat.from_date_time,
    route_schedule_rates_per_seat.to_date_time
FROM 
    routes
JOIN 
    route_schedules 
    ON routes.id = route_schedules.route_id
JOIN 
    cities_serviced AS source_city 
    ON source_city.id = routes.source_city_id
JOIN 
    cities_serviced AS destination_city 
    ON destination_city.id = routes.destination_city_id
JOIN 
    route_schedule_rates_per_seat 
    ON route_schedules.id = route_schedule_rates_per_seat.route_schedule_id
WHERE 
    route_schedules.is_deleted = FALSE;
`);

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_SCHEDULE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_SCHEDULE_RETRIEVED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE_SCHEDULE,
      error.message
    );
  }
};
