import express from "express";
import {
  createOvertimeRequestController,
  getOvertimeRequestsByUserController,
  getPendingOvertimeRequestsController,
  getOvertimeRequestDetailController,
  approveOvertimeRequestController,
  rejectOvertimeRequestController,
  cancelOvertimeRequestController,
  updateOvertimeRequestController,
  getOvertimeStatisticsController,
} from "../../controllers/works/overtime-request.controller.js";

const router = express.Router();

/**
 * Routes for Overtime Request Management
 */

// VN: Tạo yêu cầu tăng ca mới
// Method: POST
// Body: { user_id, work_id?, requested_date, start_time, end_time, duration_minutes?, reason, overtime_type }
router.post("/", createOvertimeRequestController);

// VN: Lấy danh sách yêu cầu tăng ca của người dùng
// Method: GET
// Params: user_id
// Query: ?status=pending&startDate=2024-01-01&endDate=2024-12-31&limit=50&offset=0
router.get("/user/:user_id", getOvertimeRequestsByUserController);

// VN: Lấy danh sách yêu cầu tăng ca chờ duyệt
// Method: GET
// Query: ?department=1&startDate=2024-01-01&endDate=2024-12-31&limit=100&offset=0
router.get("/pending/list", getPendingOvertimeRequestsController);

// VN: Lấy chi tiết yêu cầu tăng ca
// Method: GET
// Params: id (request id)
router.get("/:id", getOvertimeRequestDetailController);

// VN: Duyệt yêu cầu tăng ca
// Method: PATCH
// Params: id (request id)
// Body: { approver_id, is_paid?, notes? }
router.patch("/:id/approve", approveOvertimeRequestController);

// VN: Từ chối yêu cầu tăng ca
// Method: PATCH
// Params: id (request id)
// Body: { approver_id, reject_reason }
router.patch("/:id/reject", rejectOvertimeRequestController);

// VN: Hủy yêu cầu tăng ca
// Method: PATCH
// Params: id (request id)
// Body: { user_id }
router.patch("/:id/cancel", cancelOvertimeRequestController);

// VN: Cập nhật yêu cầu tăng ca (chỉ pending request)
// Method: PUT
// Params: id (request id)
// Body: { user_id, start_time?, end_time?, duration_minutes?, reason?, overtime_type? }
router.put("/:id", updateOvertimeRequestController);

// VN: Lấy thống kê tăng ca
// Method: GET
// Query: ?user_id=1&department=1&startDate=2024-01-01&endDate=2024-12-31&status=approved
router.get("/statistics/summary", getOvertimeStatisticsController);

export default router;
