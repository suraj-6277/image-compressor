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
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like curl/Postman) and known local dev origins.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/", imageRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  if (!process.env.MONGO_URI) {
    console.warn("Mongo URI missing. Running in in-memory metadata mode.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.warn(`MongoDB unavailable. Continuing in in-memory metadata mode. (${error.message})`);
  }
};

startServer();
