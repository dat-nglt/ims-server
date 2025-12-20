import express from "express";
import { getCloudinarySignature } from "../../controllers/operations/uploads.controller.js";

const routerForUpload = express.Router();

/**
 * POST /cloudinary/sign
 * Body: { folder?: string }
 * Returns: { signature, timestamp, api_key, cloud_name, folder }
 */
routerForUpload.post("/cloudinary/sign", getCloudinarySignature);

export default routerForUpload;
