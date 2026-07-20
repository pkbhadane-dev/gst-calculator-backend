export const catchError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    message: message,
    error: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
