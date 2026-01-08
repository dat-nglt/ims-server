import express from "express";
import {
  getAllAttendanceController,
  getAttendanceByIdController,
  checkInController,
  checkOutController,
  getAttendanceHistoryByUserIdController,
  getTechniciansLocationsController,
  getOfficeLocationController,
  getTechnicianLocationHistoryController,
  getJobItemsLocationsController,
  getGeocodingReverseController,
  getAttendanceSummaryController,
  getAttendanceStatisticsController,
  getAllAttendanceSessionsController,
  getAttendanceSessionByIdController,
  getActiveSessionByUserController,
  getClosedSessionsController,
  checkOutSessionController,
  getAllAttendanceTypesController,
  getAttendanceTypeByIdController,
  createAttendanceTypeController,
  updateAttendanceTypeController,
  deleteAttendanceTypeController,
  getCurrentDayAttendanceHistoryByUserIdController,
  getCurrentMonthAttendanceHistoryByUserIdController,
  getDailyCheckInRangeByUserController,
  getAllUsersAttendanceRangeController,
} from "../../controllers/operations/attendance.controller.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Routes: /operations/attendance
// Grouped and concise route comments follow.

// --- Check-in/out routes

// GET / - list attendances
router.get("/", getAllAttendanceController);

// GET /user/:userId - user attendance history
router.get("/user/:userId", getAttendanceHistoryByUserIdController);

// GET /user/today/:userId - today's attendance for user
router.get("/user/today/:userId", getCurrentDayAttendanceHistoryByUserIdController);

// GET /user/month/:userId - current month's attendance for user
router.get("/user/month/:userId", getCurrentMonthAttendanceHistoryByUserIdController);

// POST /check-in - create attendance (check-in)
router.post("/check-in", checkAuth, checkInController);

// POST /check-out - complete an attendance (check-out)
router.post("/check-out", checkAuth, checkOutController);

// GET /:id - get attendance by id
router.get("/:id", getAttendanceByIdController);

// --- Session routes

// GET /sessions/all - list attendance sessions
router.get("/sessions/all", getAllAttendanceSessionsController);

// GET /sessions/user/:userId/active - active session for user
router.get("/sessions/user/:userId/active", getActiveSessionByUserController);

// GET /sessions/closed - closed sessions
router.get("/sessions/closed", getClosedSessionsController);

// POST /sessions/:sessionId/check-out - close a session
router.post("/sessions/:sessionId/check-out", checkOutSessionController);

// GET /sessions/:id - get session by id
router.get("/sessions/:id", getAttendanceSessionByIdController);

// --- Location routes

// GET /locations/technicians - technicians locations
router.get("/locations/technicians", getTechniciansLocationsController);

// GET /locations/office - office location
router.get("/locations/office", getOfficeLocationController);

// GET /locations/technicians/:technicianId/history - technician location history
router.get("/locations/technicians/:technicianId/history", getTechnicianLocationHistoryController);

// GET /locations/job-items - job items locations
router.get("/locations/job-items", getJobItemsLocationsController);

// GET /locations/geocoding/reverse - reverse geocoding
router.get("/locations/geocoding/reverse", getGeocodingReverseController);

// --- Attendance type routes

// GET /types - list attendance types
router.get("/types", getAllAttendanceTypesController);

// POST /types - create attendance type
router.post("/types", createAttendanceTypeController);

// GET /types/:id - get attendance type by id
router.get("/types/:id", getAttendanceTypeByIdController);

// PUT /types/:id - update attendance type
router.put("/types/:id", updateAttendanceTypeController);

// DELETE /types/:id - delete attendance type
router.delete("/types/:id", deleteAttendanceTypeController);

// --- Reports routes

// GET /reports/summary - attendance summary
router.get("/reports/summary", getAttendanceSummaryController);

// GET /reports/statistics - attendance statistics
router.get("/reports/statistics", getAttendanceStatisticsController);

// GET /reports/daily-range/user/:userId - daily check-in range for user
router.get("/reports/daily-range/user/:userId", getDailyCheckInRangeByUserController);

// GET /reports/daily-range/all-users - daily range for all users
router.get("/reports/daily-range/all-users", getAllUsersAttendanceRangeController);

export default router;
