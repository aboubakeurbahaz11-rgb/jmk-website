const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to create storage configuration
const createCloudinaryStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `jmk_${folderName}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
  });
};

// Helper to extract public_id and delete image
const deleteImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
  try {
    // Extract public_id from url. 
    // Example url: https://res.cloudinary.com/cloudname/image/upload/v123456789/folder/filename.jpg
    const parts = imageUrl.split('/');
    const folderAndFile = parts.slice(-2).join('/'); // 'folder/filename.jpg'
    const publicId = folderAndFile.split('.')[0]; // 'folder/filename'
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err.message);
  }
};

module.exports = {
  cloudinary,
  createCloudinaryStorage,
  uploadMiddleware: (folderName) => multer({ 
    storage: createCloudinaryStorage(folderName),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }),
  deleteImage
};
