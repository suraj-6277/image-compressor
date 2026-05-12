const path = require("path");
const multer = require("multer");
const { ensureDirectory, originalUploadsDir, getExtFromMimetype } = require("./fileHelpers");

ensureDirectory(originalUploadsDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, originalUploadsDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || `.${getExtFromMimetype(file.mimetype)}`;
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension.toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const valid = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!valid.includes(file.mimetype)) return cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
