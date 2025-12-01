import logger from "../../utils/logger.js";
import * as userRolePermissionService from "../../services/users/index.js";

/**
 * Lấy tất cả quyền hạn người dùng
 */
export const getAllUserRolePermissionsController = async (req, res) => {
  try {
    const result =
      await userRolePermissionService.getAllUserRolePermissionsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách quyền hạn người dùng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllUserRolePermissionsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy quyền hạn của một người dùng
 */
export const getUserPermissionsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result =
      await userRolePermissionService.getUserPermissionsByUserIdService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy quyền hạn người dùng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getUserPermissionsByUserIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cấp quyền cho người dùng
 */
export const grantPermissionToUserController = async (req, res) => {
  try {
    const permissionData = {
      ...req.body,
      granted_by: req.user?.id,
    };
    const result = await userRolePermissionService.grantPermissionToUserService(permissionData);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Cấp quyền thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in grantPermissionToUserController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Thu hồi quyền từ người dùng
 */
export const revokePermissionFromUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userRolePermissionService.revokePermissionFromUserService(id, req.user?.id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in revokePermissionFromUserController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};
