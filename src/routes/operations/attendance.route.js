import express from "express";
import {
  // Check-in/out
  getAllAttendanceController,
  getAttendanceByIdController,
  checkInController,
  checkOutController,
  getAttendanceHistoryByUserIdController,
  // Locations
  getTechniciansLocationsController,
  getOfficeLocationController,
  getTechnicianLocationHistoryController,
  getJobItemsLocationsController,
  getGeocodingReverseController,
  // Summary & Statistics
  getAttendanceSummaryController,
  getAttendanceStatisticsController,
  // Attendance Sessions
  getAllAttendanceSessionsController,
  getAttendanceSessionByIdController,
  getActiveSessionByUserController,
  getClosedSessionsController,
  checkOutSessionController,
  // Attendance Types
  getAllAttendanceTypesController,
  getAttendanceTypeByIdController,
  createAttendanceTypeController,
  updateAttendanceTypeController,
  deleteAttendanceTypeController,
} from "../../controllers/operations/attendance.controller.js";

const router = express.Router();

// ==================== CHECK-IN/OUT ROUTES ====================

// GET all attendance
router.get("/", getAllAttendanceController);

// GET attendance history for user (phải ở trước /:id để tránh conflict)
router.get("/user/:userId", getAttendanceHistoryByUserIdController);

// CHECK-IN
router.post("/check-in", checkInController);

// CHECK-OUT by attendance ID
router.post("/:id/check-out", checkOutController);

// GET attendance by ID
router.get("/:id", getAttendanceByIdController);

// ==================== ATTENDANCE SESSION ROUTES ====================

// GET all attendance sessions
router.get("/sessions/all", getAllAttendanceSessionsController);

// GET active session for user
router.get("/sessions/user/:userId/active", getActiveSessionByUserController);

// GET closed sessions (trong khoảng thời gian)
router.get("/sessions/closed", getClosedSessionsController);

// CHECK-OUT from session (đóng phiên chấm công)
router.post("/sessions/:sessionId/check-out", checkOutSessionController);

// GET attendance session by ID
router.get("/sessions/:id", getAttendanceSessionByIdController);

// ==================== LOCATION ROUTES ====================

// GET danh sách vị trí kỹ thuật viên
router.get("/locations/technicians", getTechniciansLocationsController);

// GET vị trí văn phòng
router.get("/locations/office", getOfficeLocationController);

// GET lịch sử vị trí kỹ thuật viên
router.get(
  "/locations/technicians/:technicianId/history",
  getTechnicianLocationHistoryController
);

// GET vị trí công việc
router.get("/locations/job-items", getJobItemsLocationsController);

// GET geocoding reverse
router.get("/locations/geocoding/reverse", getGeocodingReverseController);

// ==================== ATTENDANCE TYPE ROUTES ====================

// GET all attendance types
router.get("/types", getAllAttendanceTypesController);

// POST create attendance type
router.post("/types", createAttendanceTypeController);

// GET attendance type by ID
router.get("/types/:id", getAttendanceTypeByIdController);

// PUT update attendance type
router.put("/types/:id", updateAttendanceTypeController);

// DELETE attendance type
router.delete("/types/:id", deleteAttendanceTypeController);

// ==================== ATTENDANCE SUMMARY & STATISTICS ROUTES ====================

// GET dữ liệu tổng quan chấm công
router.get("/reports/summary", getAttendanceSummaryController);

// GET thống kê chấm công
router.get("/reports/statistics", getAttendanceStatisticsController);

export default router;
