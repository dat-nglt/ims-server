import express from "express";
import { getProfileInfoController } from "../../controllers/mini-app/profile.controller.js";

const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/:UID", /* authMiddleware, */ getProfileInfoController);

export default router;
