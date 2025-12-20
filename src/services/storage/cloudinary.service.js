import cloudinary from 'cloudinary';
import logger from '../../utils/logger.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (publicId) => {
  try {
    const res = await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'image' });
    return res;
  } catch (error) {
    logger.error('Error deleting image from Cloudinary: ' + error.message);
    throw error;
  }
};
