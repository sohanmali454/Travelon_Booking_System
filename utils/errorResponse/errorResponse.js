export const errorResponse = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({
    status_code: statusCode,
    message,
    data: error,
  });
};
