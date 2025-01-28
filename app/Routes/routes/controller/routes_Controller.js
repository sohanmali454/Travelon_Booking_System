import { pool } from "../../../../config/database/db.js";
import { errorResponse } from "../../../../utils/errorResponse/errorResponse.js";
import { successResponse } from "../../../../utils/successResponse/successResponse.js";
import { RoutesMessages } from "../utils/messages.js";
import { RoutesStatusCode } from "../utils/statusCode.js";

// CREATE ROUTE
export const createRoute = async (req, res) => {
  const {
    title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status,
  } = req.body;
  console.log("Incoming request params & body:", [req.params], req.body);

  if (!source_city_id || !destination_city_id || !travel_time_in_hours) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO routes (title, source_city_id, destination_city_id, travel_time_in_hours, details, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        title,
        source_city_id,
        destination_city_id,
        travel_time_in_hours,
        details,
        status,
      ]
    );

    successResponse(
      res,
      RoutesStatusCode.CREATED,
      RoutesMessages.ROUTE_CREATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_CREATING_ROUTE,
      error.message
    );
  }
};

// GET ROUTE BY ID
export const getRouteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status FROM routes WHERE id = $1 AND is_deleted = FALSE`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_RETRIEVED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTE,
      error.message
    );
  }
};

// UPDATE ROUTE
export const updateRoute = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status,
  } = req.body;
  console.log("Incoming request params & body:", [req.params], req.body);

  try {
    const result = await pool.query(
      `UPDATE routes SET title = $1, source_city_id = $2, destination_city_id = $3, travel_time_in_hours = $4, details = $5, status = $6, 
       updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
      [
        title,
        source_city_id,
        destination_city_id,
        travel_time_in_hours,
        details,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_UPDATED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_UPDATING_ROUTE,
      error.message
    );
  }
};

// DELETE ROUTE (Soft Delete)
export const deleteRoute = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE routes 
       SET is_deleted = TRUE
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTE_DELETED,
      result.rows[0]
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_DELETING_ROUTE,
      error.message
    );
  }
};

// GET ALL ROUTES
export const getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title,
    source_city_id,
    destination_city_id,
    travel_time_in_hours,
    details,
    status FROM routes WHERE is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};

// GET ROUTES BY ALL SOURCE CITY
export const getRoutesBySourceAllCity = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         routes.source_city_id, 
         cities_serviced.city_name, 
         cities_serviced.description, 
         cities_serviced.status 
       FROM 
         routes 
       JOIN 
         cities_serviced 
       ON 
         routes.source_city_id = cities_serviced.id 
       WHERE 
       is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};

// GET ROUTES BY SOURCE CITY ID
export const getRoutesBySourceCityId = async (req, res) => {
  const { source_city_id } = req.query;

  if (!source_city_id) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `SELECT 
         routes.source_city_id, 
         cities_serviced.city_name, 
         cities_serviced.description, 
         cities_serviced.status 
       FROM 
         routes 
       JOIN 
         cities_serviced 
       ON 
         routes.source_city_id = cities_serviced.id 
       WHERE 
         routes.source_city_id = $1 AND is_deleted = FALSE`,
      [source_city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};

// GET ROUTES BY ALL DESTINATION CITY
export const getRoutesByDestinationAllCity = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         routes.destination_city_id, 
         cities_serviced.city_name, 
         cities_serviced.description, 
         cities_serviced.status 
       FROM 
         routes 
       JOIN 
         cities_serviced 
       ON 
         routes.destination_city_id = cities_serviced.id 
       WHERE 
      is_deleted = FALSE`
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};

// GET ROUTES BY DESTINATION CITY ID
export const getRoutesByDestinationCityId = async (req, res) => {
  const { destination_city_id } = req.query;

  if (!destination_city_id) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `SELECT 
         routes.destination_city_id, 
         cities_serviced.city_name, 
         cities_serviced.description, 
         cities_serviced.status 
       FROM 
         routes 
       JOIN 
         cities_serviced 
       ON 
         routes.destination_city_id = cities_serviced.id 
       WHERE 
         routes.destination_city_id = $1 AND is_deleted = FALSE`,
      [destination_city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};

// GET ROUTES BY SOURCE AND DESTINATION CITY IDS (Query String)
export const getRoutesBySourceAndDestination = async (req, res) => {
  const { source_city_id, destination_city_id } = req.query;

  if (!source_city_id || !destination_city_id) {
    return errorResponse(
      res,
      RoutesStatusCode.BAD_REQUEST,
      RoutesMessages.REQUIRED_FIELDS_MISSING
    );
  }

  try {
    const result = await pool.query(
      `SELECT 
    routes.title, 
    routes.details,
  routes.source_city_id,   
  source_city.city_name AS source_city_name, 
    source_city.description AS source_city_description,
	source_city.status AS source_city_status, 
  routes.destination_city_id, 
  destination_city.city_name AS destination_city_name, 
  destination_city.description AS destination_city_description,
  destination_city.status AS destination_city_status
FROM 
  routes
JOIN 
  cities_serviced AS source_city 
ON 
  routes.source_city_id = source_city.id
JOIN 
  cities_serviced AS destination_city 
ON 
  routes.destination_city_id = destination_city.id
WHERE
  routes.source_city_id = $1 AND routes.destination_city_id = $2 AND is_deleted = FALSE;
`,
      [source_city_id, destination_city_id]
    );

    if (result.rows.length === 0) {
      return errorResponse(
        res,
        RoutesStatusCode.NOT_FOUND,
        RoutesMessages.ROUTE_NOT_FOUND
      );
    }

    successResponse(
      res,
      RoutesStatusCode.SUCCESS,
      RoutesMessages.ROUTES_FETCHED,
      result.rows
    );
  } catch (error) {
    errorResponse(
      res,
      RoutesStatusCode.INTERNAL_SERVER_ERROR,
      RoutesMessages.ERROR_FETCHING_ROUTES,
      error.message
    );
  }
};
