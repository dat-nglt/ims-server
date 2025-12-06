import logger from "../../utils/logger.js";
import * as roleService from "../../services/users/index.js";

/**
 * Lấy danh sách tất cả vai trò
 */
export const getAllRolesController = async (req, res) => {
    try {
        const result = await roleService.getAllRolesService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách vai trò thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllRolesController: ${error.message}`
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy vai trò theo ID
 */
export const getRoleByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleService.getRoleByIdService(id);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin vai trò thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getRoleByIdController: ${error.message}`
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Tạo vai trò mới (single hoặc bulk)
 */
export const createRoleController = async (req, res) => {
    try {
        const created_by = req.user?.id; // Giả sử middleware auth set req.user

        if (Array.isArray(req.body)) {
            // Bulk create
            const result = await roleService.bulkCreateRolesService(req.body, created_by);
            res.status(201).json({
                status: "success",
                data: result.data,
                message: `Tạo ${result.data.length} vai trò thành công`,
            });
        } else {
            // Single create
            const roleData = {
                ...req.body,
                created_by,
            };
            const result = await roleService.createRoleService(roleData);
            res.status(201).json({
                status: "success",
                data: result.data,
                message: "Tạo vai trò thành công",
            });
        }
    } catch (error) {
        logger.error(`[${req.id}] Error in createRoleController: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Cập nhật vai trò
 */
export const updateRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_by: req.user?.id,
        };
        const result = await roleService.updateRoleService(id, updateData);
        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật vai trò thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in updateRoleController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Xóa vai trò
 */
export const deleteRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleService.deleteRoleService(id, req.user?.id);
        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in deleteRoleController: ${error.message}`
        );
        res.status(404).json({ error: error.message });
    }
};
