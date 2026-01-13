import express from "express";
import * as uploadsControllers from "../../controllers/operations/uploads.controller.js";

const routerForUpload = express.Router();

/**
 * POST /cloudinary/sign
 * Body: { folder?: string }
 * Returns: { signature, timestamp, api_key, cloud_name, folder }
 */
routerForUpload.post("/cloudinary/sign", uploadsControllers.getCloudinarySignature);

export default routerForUpload;
