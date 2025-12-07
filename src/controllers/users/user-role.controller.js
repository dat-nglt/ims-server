import logger from "../../utils/logger.js";
import * as userRoleService from "../../services/users/user-role.service.js";

/**
 * Gán role cho user
 */
export const assignRoleController = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        // const assignedById = req.user.id; // Giả sử từ middleware auth
        const assignedById = 1; // Giả sử từ middleware auth

        const result = await userRoleService.assignRoleService(
            userId,
            roleId,
            assignedById
        );
        res.status(201).json({
            status: "success",
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in assignRoleController: ${error.message}`
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lấy danh sách roles của user
 */
export const getUserRolesController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await userRoleService.getUserRolesService(userId);
        res.json({
            status: "success",
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getUserRolesController: ${error.message}`
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Thu hồi role từ user
 */
export const revokeRoleController = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const revokedById = req.user.id;

        const result = await userRoleService.revokeRoleService(
            userId,
            roleId,
            revokedById
        );
        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in revokeRoleController: ${error.message}`
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Lấy danh sách quyền của user
 */
export const getUserPermissionsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await userRoleService.getUserPermissionsService(userId);
        res.json({
            status: "success",
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getUserPermissionsController: ${error.message}`
        );
        res.status(404).json({ error: error.message });
    }
};
