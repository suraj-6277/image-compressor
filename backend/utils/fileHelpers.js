const fs = require("fs");
const path = require("path");

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const getExtFromMimetype = (mimetype = "") => {
  if (mimetype.includes("jpeg") || mimetype.includes("jpg")) return "jpg";
  if (mimetype.includes("png")) return "png";
  if (mimetype.includes("webp")) return "webp";
  return "jpg";
};

const uploadsRoot = path.join(__dirname, "..", "uploads");
const originalUploadsDir = path.join(uploadsRoot, "original");
const compressedUploadsDir = path.join(uploadsRoot, "compressed");

module.exports = {
  ensureDirectory,
  getExtFromMimetype,
  uploadsRoot,
  originalUploadsDir,
  compressedUploadsDir,
};
