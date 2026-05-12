const multer = require("multer");

const notFound = (_req, res) => {
  res.status(404).json({ message: "Route not found." });
};

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({ message: err.message || "Something went wrong." });
};

module.exports = { notFound, errorHandler };
