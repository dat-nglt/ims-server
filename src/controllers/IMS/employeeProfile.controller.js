import logger from "../../utils/logger.js";
import * as employeeProfileService from "../../services/IMS/employeeProfile.service.js";

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
    logger.error(
      `[${req.id}] Error in getAllEmployeeProfilesController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy hồ sơ theo user ID
 */
export const getEmployeeProfileByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await employeeProfileService.getEmployeeProfileByUserIdService(userId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin hồ sơ nhân viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getEmployeeProfileByUserIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo hồ sơ
 */
export const createEmployeeProfileController = async (req, res) => {
  try {
    const result = await employeeProfileService.createEmployeeProfileService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo hồ sơ nhân viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createEmployeeProfileController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật hồ sơ
 */
export const updateEmployeeProfileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await employeeProfileService.updateEmployeeProfileService(userId, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật hồ sơ nhân viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateEmployeeProfileController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
