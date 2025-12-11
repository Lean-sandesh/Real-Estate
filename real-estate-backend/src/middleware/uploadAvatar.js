const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for avatars!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
  },
  fileFilter: fileFilter,
});

// Custom Cloudinary upload function for avatars
const uploadAvatarToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('No file provided'));
    }

    // Convert buffer to base64
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    cloudinary.uploader.upload(
      fileStr,
      {
        folder: 'avatars',
        resource_type: 'image',
        transformation: [
          { width: 200, height: 200, crop: 'fill' }, // Square crop for avatars
          { quality: 'auto' },
          { format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Delete avatar from Cloudinary
const deleteAvatarFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Single upload middleware for avatars
const uploadAvatar = upload.single('avatar');

module.exports = {
  uploadAvatar,
  uploadAvatarToCloudinary,
  deleteAvatarFromCloudinary
};