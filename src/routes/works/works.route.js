import express from "express";
import {
  getAllWorksController,
  getWorksController,
  getWorksStatisticsController,
  getWorksDistributionController,
  getWorksByStatusController,
  createWorkController,
  updateWorkController,
  approveWorkController,
  cancelWorkController,
  deleteWorkController,
  getWorkCategoriesController,
  getServiceTypesController,
  exportWorksController,
  getWorkByCodeController,
  getTechnicianListToAssignController,
} from "../../controllers/works/work.controller.js";

const router = express.Router();

// ===== Works routes (Routes for managing "works") =====
// VN: Các route liên quan tới "works" (công việc) - bao gồm lấy danh sách, lấy chi tiết, thống kê, tạo, cập nhật, phê duyệt, xóa, danh mục, loại dịch vụ, xuất dữ liệu, v.v.
// EN: Works-related routes - includes listing, detail, statistics, create, update, approve, delete, categories, service types, export, etc.

// VN: Lấy danh sách công việc với lọc, phân trang, tìm kiếm và sắp xếp
// EN: Get works with filters, pagination, search and sort
router.get("/", getWorksController); // Đã dùng

// VN: Lấy danh sách kỹ thuật viên có thể phân công cho công việc
// EN: Get technician list available to assign to works
router.get("/technicians-list-to-assign", getTechnicianListToAssignController);

// VN: Lấy công việc theo mã công việc (workCode)
// EN: Get work by workCode
router.get("/:workCode", getWorkByCodeController); // Đã dùng

// VN: Lấy tất cả công việc (legacy - có thể dùng lại hoặc loại bỏ)
// EN: Get all works (legacy - may be kept or removed)
router.get("/all", getAllWorksController);

// VN: Thống kê công việc (số liệu / biểu đồ)
// EN: Get works statistics
router.get("/statistics", getWorksStatisticsController);

// VN: Phân phối công việc (distribution)
// EN: Get works distribution
router.get("/distribution", getWorksDistributionController);

// VN: Lấy danh sách loại danh mục công việc
// EN: Get work categories
router.get("/categories", getWorkCategoriesController);

// VN: Lấy danh sách loại dịch vụ liên quan tới công việc
// EN: Get service types
router.get("/service-types", getServiceTypesController);

// VN: Xuất dữ liệu công việc (export)
// EN: Export works data
router.get("/export", exportWorksController);

// VN: Lấy công việc theo trạng thái — *KHÔNG* để sau route động `/:workCode` nếu có thể (đặt trước to avoid conflict)
// EN: Get works by status — *DO NOT* place after dynamic `/:workCode` route to avoid route conflicts (define before dynamic params)
router.get("/status/:status", getWorksByStatusController);

// VN: Tạo công việc mới
// EN: Create new work
router.post("/", createWorkController);

// VN: Cập nhật thông tin công việc (theo ID)
// EN: Update work by ID
router.put("/:id", updateWorkController);

// VN: Phê duyệt công việc
// EN: Approve work
router.patch("/:id/approve", approveWorkController);

// VN: Hủy công việc (cập nhật status thành 'cancelled')
// EN: Cancel work (update status to 'cancelled')
router.put("/cancel/:id", cancelWorkController);

// VN: Xóa công việc (xóa bản ghi khỏi database)
// EN: Delete work (remove record from database)
router.delete("/:id", deleteWorkController);

export default router;
