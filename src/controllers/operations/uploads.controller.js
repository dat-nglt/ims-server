import cloudinary from 'cloudinary';
import logger from '../../utils/logger.js';

// Return signature for client-side signed Cloudinary uploads
export const getCloudinarySignature = (req, res) => {
  try {
    const { folder } = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { timestamp };
    if (folder) paramsToSign.folder = folder;

    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        folder: folder || 'attendances',
      },
    });
  } catch (error) {
    logger.error('Error getting Cloudinary signature: ' + error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
