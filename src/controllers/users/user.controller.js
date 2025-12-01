import logger from "../../utils/logger.js";
import * as userService from "../../services/users/index.js";

/**
 * Lấy danh sách tất cả người dùng
 */
export const getAllUsersController = async (req, res) => {
    try {
        const result = await userService.getAllUsersService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách người dùng thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllUsersController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserByIdService(id);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin người dùng thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getUserByIdController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Tạo người dùng mới
 */
export const createUserController = async (req, res) => {
    try {
        const result = await userService.createUserService(req.body);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo người dùng thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in createUserController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Cập nhật thông tin người dùng
 */
export const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.updateUserService(id, req.body);
        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật người dùng thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in updateUserController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Xóa người dùng
 */
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserService(id);
        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in deleteUserController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};
