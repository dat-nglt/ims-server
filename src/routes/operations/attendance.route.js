import express from "express";
import * as attendanceControllers from "../../controllers/operations/attendance.controller.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Routes: /operations/attendance
// Grouped and concise route comments follow.

// --- Check-in/out routes

// GET / - list attendances
router.get("/", attendanceControllers.getAllAttendanceController);

// GET /user/:userId - user attendance history
router.get("/user/:userId", attendanceControllers.getAttendanceHistoryByUserIdController);

// GET /user/today/:userId - today's attendance for user
router.get("/user/today/:userId", attendanceControllers.getCurrentDayAttendanceHistoryByUserIdController);

// GET /user/month/:userId - current month's attendance for user
router.get("/user/month/:userId", attendanceControllers.getCurrentMonthAttendanceHistoryByUserIdController);

// POST /check-in - create attendance (check-in)
router.post("/check-in", checkAuth, attendanceControllers.checkInController);

// POST /check-out - complete an attendance (check-out)
router.post("/check-out", checkAuth, attendanceControllers.checkOutController);

// GET /:id - get attendance by id
router.get("/:id", attendanceControllers.getAttendanceByIdController);

// --- Session routes

// GET /sessions/all - list attendance sessions
router.get("/sessions/all", attendanceControllers.getAllAttendanceSessionsController);

// GET /sessions/user/:userId/active - active session for user
router.get("/sessions/user/:userId/active", attendanceControllers.getActiveSessionByUserController);

// GET /sessions/closed - closed sessions
router.get("/sessions/closed", attendanceControllers.getClosedSessionsController);

// POST /sessions/:sessionId/check-out - close a session
router.post("/sessions/:sessionId/check-out", checkAuth, attendanceControllers.checkOutSessionController);

// GET /sessions/:id - get session by id
router.get("/sessions/:id", attendanceControllers.getAttendanceSessionByIdController);

// --- Location routes

// GET /locations/technicians - technicians locations
router.get("/locations/technicians", attendanceControllers.getTechniciansLocationsController);

// GET /locations/office - office location
router.get("/locations/office", attendanceControllers.getOfficeLocationController);

// GET /locations/technicians/:technicianId/history - technician location history
router.get(
  "/locations/technicians/:technicianId/history",
  attendanceControllers.getTechnicianLocationHistoryController
);

// GET /locations/job-items - job items locations
router.get("/locations/job-items", attendanceControllers.getJobItemsLocationsController);

// --- Reports routes

// GET /reports/summary - attendance summary
router.get("/reports/summary", attendanceControllers.getAttendanceSummaryController);

// GET /reports/statistics - attendance statistics
router.get("/reports/statistics", attendanceControllers.getAttendanceStatisticsController);

// GET /reports/daily-range/user/:userId - daily check-in range for user
router.get("/reports/daily-range/user/:userId", attendanceControllers.getDailyCheckInRangeByUserController);

// GET /reports/daily-range/all-users - daily range for all users
router.get("/reports/daily-range/all-users", attendanceControllers.getAllUsersAttendanceRangeController);

export default router;
