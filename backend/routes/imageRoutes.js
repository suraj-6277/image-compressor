const express = require("express");
const upload = require("../utils/upload");
const { uploadImage, compressImage, downloadCompressedImage } = require("../controllers/imageController");

const router = express.Router();
router.post("/upload", upload.single("image"), uploadImage);
router.post("/compress", upload.single("image"), compressImage);
router.get("/download/:id", downloadCompressedImage);

module.exports = router;
