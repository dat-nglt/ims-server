import logger from "../../utils/logger.js";
import * as permissionService from "../../services/IMS/permission.service.js";

/**
 * Lấy danh sách tất cả quyền hạn
 */
export const getAllPermissionsController = async (req, res) => {
  try {
    const result = await permissionService.getAllPermissionsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách quyền hạn thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllPermissionsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy quyền hạn theo ID
 */
export const getPermissionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await permissionService.getPermissionByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin quyền hạn thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getPermissionByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo quyền hạn mới
 */
export const createPermissionController = async (req, res) => {
  try {
    const result = await permissionService.createPermissionService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo quyền hạn thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createPermissionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật quyền hạn
 */
export const updatePermissionController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await permissionService.updatePermissionService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật quyền hạn thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updatePermissionController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa quyền hạn
 */
export const deletePermissionController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await permissionService.deletePermissionService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deletePermissionController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};
