import logger from "../utils/logger.js";
import * as workService from "../services/work.service.js";

/**
 * Lấy danh sách tất cả công việc
 */
export const getAllWorksController = async (req, res) => {
  try {
    const result = await workService.getAllWorksService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách công việc thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllWorksController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy công việc theo ID
 */
export const getWorkByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workService.getWorkByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo công việc mới
 */
export const createWorkController = async (req, res) => {
  try {
    const result = await workService.createWorkService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật công việc
 */
export const updateWorkController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workService.updateWorkService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateWorkController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa công việc
 */
export const deleteWorkController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workService.deleteWorkService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteWorkController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Lấy công việc theo trạng thái
 */
export const getWorksByStatusController = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await workService.getWorksByStatusService(status);
    res.json({
      status: "success",
      data: result.data,
      message: `Lấy danh sách công việc trạng thái ${status} thành công`,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorksByStatusController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
