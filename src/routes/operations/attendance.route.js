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
  getCurrentDayAttendanceHistoryByUserIdController,
  getCurrentMonthAttendanceHistoryByUserIdController,
  getDailyCheckInRangeByUserController,
} from "../../controllers/operations/attendance.controller.js";

const router = express.Router();

/**
 * Attendance routes
 * Base path: /operations/attendance
 *
 * Chú ý: Mỗi route phía dưới đều gọi các controller tương ứng. Phần mô tả dưới đây
 * nêu rõ phương thức HTTP, đường dẫn (relative to base path), mục đích, tham số
 * (path/query/body) thường dùng, và kiểu phản hồi mong đợi.
 */

// ==================== CHECK-IN/OUT ROUTES ====================

/**
 * GET /
 * Mô tả: Lấy danh sách tất cả bản ghi chấm công.
 * Query params (tuỳ controller):
 *  - page (number): trang hiện tại
 *  - limit (number): số bản ghi / trang
 *  - startDate (ISO date): lọc từ ngày
 *  - endDate (ISO date): lọc đến ngày
 *  - userId (string): lọc theo người dùng
 *  - typeId (string): lọc theo loại chấm công
 *  - sessionId (string): lọc theo phiên chấm công
 * Response: 200 OK -> { data: [attendance], meta: { total, page, limit } }
 * Controller: getAllAttendanceController
 */
router.get("/", getAllAttendanceController);

/**
 * GET /user/:userId
 * Mô tả: Lấy lịch sử chấm công của một người dùng cụ thể.
 * Path params:
 *  - userId (string): id của người dùng
 * Query params (tuỳ controller): startDate, endDate, page, limit
 * Response: 200 OK -> { data: [attendance], meta }
 * Controller: getAttendanceHistoryByUserIdController
 * Lưu ý: route này phải đặt trước `/:id` để tránh xung đột với route lấy theo id
 */
router.get("/user/:userId", getAttendanceHistoryByUserIdController);

/** * GET /user/today/:userId
 * Mô tả: Lấy lịch sử chấm công trong ngày hôm nay của một người dùng cụ thể.
 * Path params:
 *  - userId (string): id của người dùng
 * Response: 200 OK -> { data: [attendance] }
 * Controller: getCurrentDayAttendanceHistoryByUserIdController
 */
router.get("/user/today/:userId", getCurrentDayAttendanceHistoryByUserIdController);

/** * GET /user/month/:userId
 * Mô tả: Lấy lịch sử chấm công trong tháng hiện tại của một người dùng cụ thể.
 * Path params:
 *  - userId (string): id của người dùng
 * Response: 200 OK -> { data: [attendance] }
 * Controller: getCurrentMonthAttendanceHistoryByUserIdController
 */
router.get("/user/month/:userId", getCurrentMonthAttendanceHistoryByUserIdController);

/**
 * POST /check-in
 * Mô tả: Thực hiện check-in cho một người dùng (bắt đầu bản ghi chấm công mới).
 * Body (tuỳ controller, ví dụ):
 *  - userId (string) | được lấy từ token xác thực
 *  - typeId (string): id loại chấm công (ví dụ: thường, đi muộn, công tác...)
 *  - location: { lat, lng, address } (object) - vị trí check-in
 *  - metadata (object): thông tin bổ sung (ghi chú, jobId...)
 * Response: 201 Created -> { data: attendance }
 * Controller: checkInController
 */
router.post("/check-in", checkInController);

/**
 * POST /check-out
 * Mô tả: Thực hiện check-out cho bản ghi chấm công. **Id** của attendance được truyền trong body
 * Body (ví dụ):
 *  - id (number|string): id của attendance cần check-out (bắt buộc)
 *  - location: { lat, lng, address } (optional)
 *  - note (string) (optional)
 * Response: 200 OK -> { data: updatedAttendance }
 * Controller: checkOutController
 */
router.post("/check-out", checkOutController);

/**
 * GET /:id
 * Mô tả: Lấy chi tiết một bản ghi chấm công theo id.
 * Path params:
 *  - id (string): id của attendance
 * Response: 200 OK -> { data: attendance }
 * Controller: getAttendanceByIdController
 */
router.get("/:id", getAttendanceByIdController);

// ==================== ATTENDANCE SESSION ROUTES ====================

/**
 * GET /sessions/all
 * Mô tả: Lấy tất cả phiên chấm công.
 * Query params (tuỳ controller): page, limit, startDate, endDate, status
 * Response: 200 OK -> { data: [sessions], meta }
 * Controller: getAllAttendanceSessionsController
 */
router.get("/sessions/all", getAllAttendanceSessionsController);

/**
 * GET /sessions/user/:userId/active
 * Mô tả: Lấy phiên chấm công đang active của một user (nếu có).
 * Path params:
 *  - userId (string)
 * Response: 200 OK -> { data: session | null }
 * Controller: getActiveSessionByUserController
 */
router.get("/sessions/user/:userId/active", getActiveSessionByUserController);

/**
 * GET /sessions/closed
 * Mô tả: Lấy các phiên chấm công đã đóng trong khoảng thời gian hoặc theo điều kiện khác.
 * Query params: startDate, endDate, page, limit, userId
 * Response: 200 OK -> { data: [sessions], meta }
 * Controller: getClosedSessionsController
 */
router.get("/sessions/closed", getClosedSessionsController);

/**
 * POST /sessions/:sessionId/check-out
 * Mô tả: Đóng phiên chấm công (check-out cho toàn bộ phiên / kết thúc phiên).
 * Path params:
 *  - sessionId (string)
 * Body (tuỳ controller): các thông tin tóm tắt phiên khi đóng (optional)
 * Response: 200 OK -> { data: closedSession }
 * Controller: checkOutSessionController
 */
router.post("/sessions/:sessionId/check-out", checkOutSessionController);

/**
 * GET /sessions/:id
 * Mô tả: Lấy chi tiết phiên chấm công theo id.
 * Path params:
 *  - id (string)
 * Response: 200 OK -> { data: session }
 * Controller: getAttendanceSessionByIdController
 */
router.get("/sessions/:id", getAttendanceSessionByIdController);

// ==================== LOCATION ROUTES ====================

/**
 * GET /locations/technicians
 * Mô tả: Lấy vị trí hiện tại (hoặc gần nhất) của tất cả kỹ thuật viên.
 * Query params (tuỳ controller): activeOnly (boolean), bbox (bounding box), lastSeenWithin (minutes)
 * Response: 200 OK -> { data: [{ technicianId, lat, lng, lastSeen, accuracy, meta }] }
 * Controller: getTechniciansLocationsController
 */
router.get("/locations/technicians", getTechniciansLocationsController);

/**
 * GET /locations/office
 * Mô tả: Lấy vị trí văn phòng cấu hình (có thể dùng để so khớp check-in dạng office).
 * Response: 200 OK -> { data: { lat, lng, address, radius } }
 * Controller: getOfficeLocationController
 */
router.get("/locations/office", getOfficeLocationController);

/**
 * GET /locations/technicians/:technicianId/history
 * Mô tả: Lấy lịch sử vị trí của một kỹ thuật viên theo khoảng thời gian.
 * Path params:
 *  - technicianId (string)
 * Query params: startDate, endDate, page, limit
 * Response: 200 OK -> { data: [locationPoints], meta }
 * Controller: getTechnicianLocationHistoryController
 */
router.get("/locations/technicians/:technicianId/history", getTechnicianLocationHistoryController);

/**
 * GET /locations/job-items
 * Mô tả: Lấy vị trí các công việc (job items) nếu hệ thống lưu trữ location cho từng job.
 * Query params (tuỳ controller): jobId, boundingBox, startDate, endDate
 * Response: 200 OK -> { data: [{ jobId, lat, lng, assignedTo, status }] }
 * Controller: getJobItemsLocationsController
 */
router.get("/locations/job-items", getJobItemsLocationsController);

/**
 * GET /locations/geocoding/reverse
 * Mô tả: Reverse geocoding - trả về địa chỉ theo lat/lng.
 * Query params:
 *  - lat (number)
 *  - lng (number)
 * Response: 200 OK -> { data: { address, formatted, components } }
 * Controller: getGeocodingReverseController
 */
router.get("/locations/geocoding/reverse", getGeocodingReverseController);

// ==================== ATTENDANCE TYPE ROUTES ====================

/**
 * GET /types
 * Mô tả: Lấy danh sách các loại chấm công (attendance types).
 * Response: 200 OK -> { data: [types] }
 * Controller: getAllAttendanceTypesController
 */
router.get("/types", getAllAttendanceTypesController);

/**
 * POST /types
 * Mô tả: Tạo một loại chấm công mới.
 * Body:
 *  - name (string): tên loại
 *  - code (string) (optional): mã ngắn
 *  - isActive (boolean) (optional)
 * Response: 201 Created -> { data: type }
 * Controller: createAttendanceTypeController
 */
router.post("/types", createAttendanceTypeController);

/**
 * GET /types/:id
 * Mô tả: Lấy chi tiết loại chấm công theo id.
 * Path params:
 *  - id (string)
 * Response: 200 OK -> { data: type }
 * Controller: getAttendanceTypeByIdController
 */
router.get("/types/:id", getAttendanceTypeByIdController);

/**
 * PUT /types/:id
 * Mô tả: Cập nhật thông tin loại chấm công.
 * Path params:
 *  - id (string)
 * Body: trường cần cập nhật (name, code, isActive, ...)
 * Response: 200 OK -> { data: updatedType }
 * Controller: updateAttendanceTypeController
 */
router.put("/types/:id", updateAttendanceTypeController);

/**
 * DELETE /types/:id
 * Mô tả: Xoá (hoặc disable) một loại chấm công.
 * Path params:
 *  - id (string)
 * Response: 204 No Content (hoặc 200 với thông báo)
 * Controller: deleteAttendanceTypeController
 */
router.delete("/types/:id", deleteAttendanceTypeController);

// ==================== ATTENDANCE SUMMARY & STATISTICS ROUTES ====================

/**
 * GET /reports/summary
 * Mô tả: Trả về dữ liệu tổng quan (summary) chấm công, phục vụ dashboard hoặc báo cáo.
 * Query params (tuỳ controller): startDate, endDate, groupBy (user/department/day/week), userId
 * Response: 200 OK -> { data: { totalCheckIns, totalCheckOuts, totalHours, ... } }
 * Controller: getAttendanceSummaryController
 */
router.get("/reports/summary", getAttendanceSummaryController);

/**
 * GET /reports/statistics
 * Mô tả: Trả về các chỉ số thống kê chấm công (số ca, thời lượng, tỉ lệ trễ, ...).
 * Query params: startDate, endDate, metric, groupBy, page, limit
 * Response: 200 OK -> { data: statistics }
 * Controller: getAttendanceStatisticsController
 */
router.get("/reports/statistics", getAttendanceStatisticsController);

// GET /reports/daily-range/user/:userId
// Query params: attendance_type_id (optional), date (ISO string, optional)
router.get("/reports/daily-range/user/:userId", getDailyCheckInRangeByUserController);

export default router;
