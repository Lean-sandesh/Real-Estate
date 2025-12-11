const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'realestate') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto'
    });

    // Delete file from local storage after upload
    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    // Delete file from local storage if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error('Image upload failed: ' + error.message);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};

const uploadMultipleToCloudinary = async (files, folder = 'realestate') => {
  try {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.path, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error('Multiple image upload failed: ' + error.message);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary
};