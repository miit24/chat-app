const express = require('express')
const multer = require("multer");
const { v2 } = require("cloudinary");
const streamifier = require("streamifier");
const expressAsyncHandler = require('express-async-handler')

const upload = multer();
const cloudinary = v2
const uploadRouter = express.Router();

uploadRouter.post(
  "/",
  upload.single("file"),
  expressAsyncHandler(async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        if (req.file) {
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        } else {
          res.json("fatal error");
        }
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
  )
);

module.exports = uploadRouter;