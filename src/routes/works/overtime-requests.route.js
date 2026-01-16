import express from "express";
import * as overtimeRequestControllers from "../../controllers/works/overtime-request.controller.js";

const router = express.Router();

/**
 * Routes for Overtime Request Management
 */

// VN: Tạo yêu cầu tăng ca mới
// Method: POST
// Body: { user_id, work_id?, requested_date, start_time, end_time, duration_minutes?, reason, overtime_type }
router.post("/", overtimeRequestControllers.createOvertimeRequestController);

router.post("/office", overtimeRequestControllers.createOvertimeRequestControllerOffice);

// VN: Lấy danh sách yêu cầu tăng ca của người dùng
// Method: GET
// Params: user_id
// Query: ?status=pending&startDate=2024-01-01&endDate=2024-12-31&limit=50&offset=0
router.get("/user/:user_id", overtimeRequestControllers.getOvertimeRequestsByUserController);

// VN: Lấy danh sách yêu cầu tăng ca chờ duyệt
// Method: GET
// Query: ?department=1&startDate=2024-01-01&endDate=2024-12-31&limit=100&offset=0
router.get("/pending/list", overtimeRequestControllers.getPendingOvertimeRequestsController);

// VN: Duyệt yêu cầu tăng ca
// Method: PATCH
// Params: id (request id)
// Body: { approver_id, is_paid?, notes? }
router.put("/:id/approve", overtimeRequestControllers.approveOvertimeRequestController);

// VN: Từ chối yêu cầu tăng ca
// Method: put
// Params: id (request id)
// Body: { approver_id, reject_reason }
router.put("/:id/reject", overtimeRequestControllers.rejectOvertimeRequestController);
// VN: Lấy thống kê tăng ca
// Method: GET
// Query: ?user_id=1&department=1&startDate=2024-01-01&endDate=2024-12-31&status=approved
router.get("/statistics/summary", overtimeRequestControllers.getOvertimeStatisticsController);

export default router;
