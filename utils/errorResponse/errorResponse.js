export const errorResponse = (
  res,
  statusCode,
  message,
  errorDetails = null
) => {
  console.error("Error Response:", {
    statusCode,
    message,
    errorDetails,
  });

  res.status(statusCode).json({
    status: "error",
    message,
    error: errorDetails,
  });
};
