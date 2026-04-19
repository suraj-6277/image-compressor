const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true, trim: true },
    originalSize: { type: Number, required: true, min: 0 },
    compressedSize: { type: Number, default: null, min: 0 },
    compressionRatio: { type: Number, default: null, min: 0 },
    format: { type: String, enum: ["jpg", "jpeg", "png", "webp"], required: true },
    originalPath: { type: String, required: true },
    compressedPath: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Image", imageSchema);
