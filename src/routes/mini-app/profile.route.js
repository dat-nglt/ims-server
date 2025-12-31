import express from "express";
import {
  getProfileInfoController,
  getListOfWorkAssignmentsController,
  getListOfWorkAssignmentsInCurrentDayController,
  getLocationByUserTokenController,
  getAttendanceLocationController,
} from "../../controllers/mini-app/profile.controller.js";
``;
const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/:UID", /* authMiddleware, */ getProfileInfoController);
router.get("/list-of-work-assignments/:UID", getListOfWorkAssignmentsController);
router.get("/list-of-work-assignments-current-day/:UID", getListOfWorkAssignmentsInCurrentDayController);

// POST /api/projects - Create a new project
router.post("/location/decode", getLocationByUserTokenController);
router.post("/attendance/location", getAttendanceLocationController);

export default router;
