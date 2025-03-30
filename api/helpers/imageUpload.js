// imageUpload.js
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import path from 'path';
import streamifier from 'streamifier';

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

/**
 * Upload an image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original file name
 * @param {string} folder - Storage folder path (e.g., 'opportunities', 'volunteers', 'stories')
 * @returns {Promise<string>} Download URL of the uploaded image
 */
const uploadImageToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Create a stream from the buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        // Optional transformations: resize, crop, etc.
        transformation: [
          { width: 1000, crop: "limit" },
          { quality: "auto" }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    // Pass the buffer to the stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export { upload, uploadImageToCloudinary };