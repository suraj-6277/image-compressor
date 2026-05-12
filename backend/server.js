const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

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

if (require.main === module) startServer();

module.exports = app;
