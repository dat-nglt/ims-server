import logger from "../utils/logger.js";
import * as systemConfigService from "../services/systemConfig.service.js";

/**
 * Lấy tất cả cấu hình
 */
export const getAllSystemConfigController = async (req, res) => {
  try {
    const result = await systemConfigService.getAllSystemConfigService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách cấu hình hệ thống thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllSystemConfigController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy cấu hình theo key
 */
export const getSystemConfigByKeyController = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await systemConfigService.getSystemConfigByKeyService(key);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy cấu hình hệ thống thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getSystemConfigByKeyController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo cấu hình
 */
export const createSystemConfigController = async (req, res) => {
  try {
    const result = await systemConfigService.createSystemConfigService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo cấu hình hệ thống thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createSystemConfigController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật cấu hình
 */
export const updateSystemConfigController = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await systemConfigService.updateSystemConfigService(key, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật cấu hình hệ thống thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateSystemConfigController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa cấu hình
 */
export const deleteSystemConfigController = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await systemConfigService.deleteSystemConfigService(key);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteSystemConfigController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};
