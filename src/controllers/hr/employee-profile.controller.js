import logger from "../../utils/logger.js";
import * as employeeProfileService from "../../services/hr/index.js";

/**
 * Lấy danh sách tất cả hồ sơ
 */
export const getAllEmployeeProfilesController = async (req, res) => {
    try {
        const result = await employeeProfileService.getAllEmployeeProfilesService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách hồ sơ nhân viên thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getAllEmployeeProfilesController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getAllEmployeeWithProfileController = async (req, res) => {
    try {
        const result = await employeeProfileService.getAllEmployeeWithProfileService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách nhân viên kèm hồ sơ thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getAllEmployeeWithProfileController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy hồ sơ theo user ID
 */
export const getEmployeeProfileByUserIdController = async (req, res) => {
    try {
        const { employee_id } = req.params; // employee_id here represents the user id in route
        const result = await employeeProfileService.getEmployeeProfileByUserIdService(employee_id);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin hồ sơ nhân viên thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getEmployeeProfileByUserIdController:` + error.message);
        res.status(404).json({ error: error.message });
    }
};

/**
 * Cập nhật hồ sơ
 */
export const updateEmployeeProfileController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await employeeProfileService.updateEmployeeProfileService(userId, req.body);

        if (!result.success) {
            return res.status(200).json({
                status: "error",
                success: false,
                message: result.message,
            });
        }

        res.status(200).json({
            status: "success",
            success: true,
            data: result.data,
            message: "Cập nhật hồ sơ nhân viên thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in updateEmployeeProfileController:`, error.message);
        res.status(500).json({
            status: "error",
            success: false,
            message: error.message,
        });
    }
};
