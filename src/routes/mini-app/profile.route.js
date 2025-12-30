import express from "express";
import {
  getProfileInfoController,
  getListOfWorkAssignmentsController,
  getListOfWorkAssignmentsInCurrentDayController,
} from "../../controllers/mini-app/profile.controller.js";
``;
const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/:UID", /* authMiddleware, */ getProfileInfoController);
router.get("/list-of-work-assignments/:UID", getListOfWorkAssignmentsController);
router.get("/list-of-work-assignments-current-day/:UID", getListOfWorkAssignmentsInCurrentDayController);

export default router;
