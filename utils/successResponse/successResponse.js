export const successResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status_code: statusCode,
    message,
    data,
  });
};
