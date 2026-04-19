const mongoose = require("mongoose");
const Image = require("../models/Image");

const memoryStore = new Map();

const toPlain = (doc) => {
  if (!doc) return null;
  if (doc.toObject) return doc.toObject();
  return doc;
};

const createId = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

const isMongoConnected = () => mongoose.connection.readyState === 1;

const createImage = async (payload) => {
  if (isMongoConnected()) {
    const doc = await Image.create(payload);
    return toPlain(doc);
  }

  const memoryDoc = {
    _id: createId(),
    ...payload,
    compressedSize: payload.compressedSize ?? null,
    compressionRatio: payload.compressionRatio ?? null,
    compressedPath: payload.compressedPath ?? null,
    createdAt: new Date(),
  };
  memoryStore.set(String(memoryDoc._id), memoryDoc);
  return memoryDoc;
};

const findImageById = async (id) => {
  if (!id) return null;
  if (isMongoConnected()) return toPlain(await Image.findById(id));
  return memoryStore.get(String(id)) || null;
};

const saveImage = async (imageDoc) => {
  if (!imageDoc) return null;
  if (isMongoConnected()) {
    await Image.findByIdAndUpdate(imageDoc._id, imageDoc, { new: false });
    return imageDoc;
  }
  memoryStore.set(String(imageDoc._id), imageDoc);
  return imageDoc;
};

module.exports = {
  createImage,
  findImageById,
  saveImage,
  isMongoConnected,
};
