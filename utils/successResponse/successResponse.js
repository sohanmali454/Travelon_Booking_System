export const successResponse = (res, statusCode, message, data = null) => {
  console.info("Success Response:", {
    statusCode,
    message,
    data,
  });

  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};
