const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const asyncHandler = require("../utils/asyncHandler");
const { ensureDirectory, compressedUploadsDir, getExtFromMimetype } = require("../utils/fileHelpers");
const { createImage, findImageById, saveImage } = require("../utils/imageStore");

ensureDirectory(compressedUploadsDir);

const formatBytes = (bytes) => {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file is required." });

  const imageDoc = await createImage({
    originalName: req.file.originalname,
    originalSize: req.file.size,
    format: getExtFromMimetype(req.file.mimetype),
    originalPath: req.file.path,
  });

  return res.status(201).json({
    id: imageDoc._id,
    originalName: imageDoc.originalName,
    originalSize: imageDoc.originalSize,
    format: imageDoc.format,
    previewUrl: `/files/original/${path.basename(req.file.path)}`,
    createdAt: imageDoc.createdAt,
  });
});

const compressImage = asyncHandler(async (req, res) => {
  const { imageId, quality = 70, format } = req.body;
  let imageDoc = imageId ? await findImageById(imageId) : null;

  if (imageId && !imageDoc) return res.status(404).json({ message: "Uploaded image not found." });
  if (!imageDoc && !req.file) return res.status(400).json({ message: "Provide imageId or attach an image file." });

  if (!imageDoc && req.file) {
    imageDoc = await createImage({
      originalName: req.file.originalname,
      originalSize: req.file.size,
      format: getExtFromMimetype(req.file.mimetype),
      originalPath: req.file.path,
    });
  }

  const targetFormat = (format || imageDoc.format || "jpg").toLowerCase();
  const normalizedQuality = Math.min(100, Math.max(10, Number(quality)));
  const outputName = `${imageDoc._id}-${Date.now()}.${targetFormat === "jpeg" ? "jpg" : targetFormat}`;
  const outputPath = path.join(compressedUploadsDir, outputName);

  let pipeline = sharp(imageDoc.originalPath);
  if (targetFormat === "png") pipeline = pipeline.png({ quality: normalizedQuality, compressionLevel: 9 });
  else if (targetFormat === "webp") pipeline = pipeline.webp({ quality: normalizedQuality });
  else pipeline = pipeline.jpeg({ quality: normalizedQuality, mozjpeg: true });

  await pipeline.toFile(outputPath);

  const compressedSize = (await fs.promises.stat(outputPath)).size;
  const percentageSaved = ((imageDoc.originalSize - compressedSize) / imageDoc.originalSize) * 100;

  imageDoc.compressedSize = compressedSize;
  imageDoc.compressionRatio = Number(percentageSaved.toFixed(2));
  imageDoc.compressedPath = outputPath;
  imageDoc.format = targetFormat;
  await saveImage(imageDoc);

  return res.status(200).json({
    originalSize: formatBytes(imageDoc.originalSize),
    compressedSize: formatBytes(compressedSize),
    percentageSaved: `${imageDoc.compressionRatio}%`,
    fileUrl: `/download/${imageDoc._id}`,
    imageId: imageDoc._id,
    originalSizeBytes: imageDoc.originalSize,
    compressedSizeBytes: compressedSize,
  });
});

const downloadCompressedImage = asyncHandler(async (req, res) => {
  const imageDoc = await findImageById(req.params.id);
  if (!imageDoc || !imageDoc.compressedPath) return res.status(404).json({ message: "Compressed file not found." });
  const originalBaseName = path.parse(imageDoc.originalName).name;
  const finalExt = imageDoc.format === "jpeg" ? "jpg" : (imageDoc.format || "jpg");
  return res.download(imageDoc.compressedPath, `compressed-${originalBaseName}.${finalExt}`);
});

module.exports = { uploadImage, compressImage, downloadCompressedImage };
