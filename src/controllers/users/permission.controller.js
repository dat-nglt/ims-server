import logger from "../../utils/logger.js";
import * as permissionService from "../../services/users/index.js";

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

// Các controller CRUD khác đã được loại bỏ - chỉ giữ lại read operations
