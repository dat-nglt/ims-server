import express from "express";
import { getCloudinarySignature } from "../../controllers/operations/uploads.controller.js";

const router = express.Router();

/**
 * POST /cloudinary/sign
 * Body: { folder?: string }
 * Returns: { signature, timestamp, api_key, cloud_name, folder }
 */
router.post("/cloudinary/sign", getCloudinarySignature);

export default router;
