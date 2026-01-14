import express from "express";
import * as workControllers from "../../controllers/works/work.controller.js";

const router = express.Router();

// VN: Lấy danh sách công việc với lọc, phân trang, tìm kiếm và sắp xếp
// Đang sử dụng
router.get("/", workControllers.getAllWorksController);

router.get("/all-works-group-by-user", workControllers.getAllWorksGroupByUserController);

// VN: Lấy danh sách kỹ thuật viên có thể phân công cho công việc
// Đang sử dụng
router.get("/technicians-list-to-assign", workControllers.getTechnicianListToAssignController);

// VN: Lấy công việc theo mã công việc (workCode)
// Đang sử dụng
router.get("/:workCode", workControllers.getWorkByCodeController);

// VN: Thống kê công việc (số liệu / biểu đồ)
router.get("/statistics", workControllers.getWorksStatisticsController);

// VN: Lấy danh sách loại dịch vụ liên quan tới công việc
router.get("/service-types", workControllers.getServiceTypesController);

// VN: Xuất dữ liệu công việc (export)
router.get("/export", workControllers.exportWorksController);

// VN: Tạo công việc mới
router.post("/", workControllers.createWorkController);

// VN: Cập nhật thông tin công việc (theo ID)
router.put("/:id", workControllers.updateWorkController);

// VN: Phê duyệt công việc
router.patch("/:id/approve", workControllers.approveWorkController);

// VN: Hủy công việc (cập nhật status thành 'cancelled')
router.put("/cancel/:id", workControllers.cancelWorkController);

// VN: Xóa công việc (xóa bản ghi khỏi database)
router.delete("/:id", workControllers.deleteWorkController);

export default router;
