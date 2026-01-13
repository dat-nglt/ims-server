import logger from "../../utils/logger.js";
import * as departmentService from "../../services/hr/index.js";

// Lấy danh sách tất cả phòng ban
export const getAllDepartmentsController = async (req, res) => {
  try {
    const { includeRoles = false, includeInactive = false, isSelection = false } = req.query;

    const result = await departmentService.getAllDepartmentsService({
      includeRoles: includeRoles === "true",
      includeInactive: includeInactive === "true",
      isSelection: isSelection === "true",
    });

    if (!result.success) {
      return res.status(400).json({ status: "error", message: result.message });
    }

    res.json({ status: "success", data: result.data, message: result.message });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllDepartmentsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

// Lấy chi tiết phòng ban với các vai trò mặc định
export const getDepartmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await departmentService.getDepartmentWithRolesByIdService(id);

    if (!result.success) {
      return res.status(404).json({ status: "error", message: result.message });
    }

    res.json({ status: "success", data: result.data, message: result.message });
  } catch (error) {
    logger.error(`[${req.id}] Error in getDepartmentByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

// Tạo phòng ban mới
export const createDepartmentController = async (req, res) => {
  try {
    const departmentData = req.body;
    const createdBy = 1;
    // const createdBy = req.user?.id;

    if (!createdBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await departmentService.createDepartmentService(departmentData, createdBy);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in createDepartmentController:` + error.message);
    res.status(400).json({ error: error.message });
  }
};

// Cập nhật phòng ban
export const updateDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // const updatedBy = req.user?.id;
    const updatedBy = 1;

    if (!updatedBy) {
      return res.status(401).json({ error: "Không có quyền" });
    }

    const result = await departmentService.updateDepartmentService(id, updateData, updatedBy);

    if (!result.success) {
      // if not found, return 404
      if (result.message && result.message.includes("Không tìm thấy")) {
        return res.status(404).json({ status: "error", message: result.message });
      }
      return res.status(400).json({ status: "error", message: result.message });
    }

    res.json({ status: "success", data: result.data, message: result.message });
  } catch (error) {
    logger.error(`[${req.id}] Error in updateDepartmentController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// Xoá phòng ban
export const deleteDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await departmentService.deleteDepartmentService(id);

    if (!result.success) {
      // not found -> 404
      if (result.message && result.message.includes("Không tìm thấy")) {
        return res.status(404).json({ status: "error", message: result.message });
      }
      return res.status(400).json({ status: "error", message: result.message });
    }

    res.json({ status: "success", message: result.message });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteDepartmentController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};
