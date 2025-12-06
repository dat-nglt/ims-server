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
 * Tạo vai trò mới
 */
export const createRoleController = async (req, res) => {
    try {
        const created_by = 1; // Sử dụng req.user.id từ middleware auth
        // const created_by = req.user?.id; // Sử dụng req.user.id từ middleware auth

        // Single create
        const { name, description, level, permissions } = req.body.roleData;
        const roleData = {
            name,
            description,
            level: parseInt(level) || 10, // Parse level to integer
            permissions,
            created_by,
        };
        const result = await roleService.createRoleService(roleData);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo vai trò thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in createRoleController: ${error.message}`
        );
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
