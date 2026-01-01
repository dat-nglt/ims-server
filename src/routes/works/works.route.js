import express from "express";
import {
  getAllWorksController, // Lấy danh sách công việc
  getWorksStatisticsController, // Lấy thống kê công việc
  createWorkController,
  updateWorkController,
  approveWorkController,
  cancelWorkController,
  deleteWorkController,
  getServiceTypesController,
  exportWorksController,
  getWorkByCodeController,
  getTechnicianListToAssignController,
} from "../../controllers/works/work.controller.js";

const router = express.Router();

// VN: Lấy danh sách công việc với lọc, phân trang, tìm kiếm và sắp xếp
// Đang sử dụng
router.get("/", getAllWorksController);

// VN: Lấy danh sách kỹ thuật viên có thể phân công cho công việc
// Đang sử dụng
router.get("/technicians-list-to-assign", getTechnicianListToAssignController);

// VN: Lấy công việc theo mã công việc (workCode)
// Đang sử dụng
router.get("/:workCode", getWorkByCodeController);

// VN: Thống kê công việc (số liệu / biểu đồ)
router.get("/statistics", getWorksStatisticsController);

// VN: Lấy danh sách loại dịch vụ liên quan tới công việc
router.get("/service-types", getServiceTypesController);

// VN: Xuất dữ liệu công việc (export)
router.get("/export", exportWorksController);

// VN: Tạo công việc mới
router.post("/", createWorkController);

// VN: Cập nhật thông tin công việc (theo ID)
router.put("/:id", updateWorkController);

// VN: Phê duyệt công việc
router.patch("/:id/approve", approveWorkController);

// VN: Hủy công việc (cập nhật status thành 'cancelled')
router.put("/cancel/:id", cancelWorkController);

// VN: Xóa công việc (xóa bản ghi khỏi database)
router.delete("/:id", deleteWorkController);

export default router;
