const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const imageRoutes = require("./routes/imageRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { ensureDirectory, uploadsRoot } = require("./utils/fileHelpers");

dotenv.config();
ensureDirectory(uploadsRoot);

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api", imageRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
