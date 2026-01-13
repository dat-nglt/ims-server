import express from "express";
import * as profileControllers from "../../controllers/mini-app/profile.controller.js";

const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/:UID", /* authMiddleware, */ profileControllers.getProfileInfoController);
router.get("/list-of-work-assignments/:UID", profileControllers.getListOfWorkAssignmentsController);
router.get("/list-of-work-assignments-current-day/:UID", profileControllers.getListOfWorkAssignmentsInCurrentDayController);

// POST /api/projects - Create a new project
router.post("/location/decode", profileControllers.getLocationByUserTokenController);
router.get("/attendance/location", profileControllers.getAttendanceLocationController);
router.get("/attendance/type", profileControllers.getAttendanceTypeController);

export default router;
