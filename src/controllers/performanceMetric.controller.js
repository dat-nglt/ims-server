import logger from "../utils/logger.js";
import * as performanceMetricService from "../services/performanceMetric.service.js";

/**
 * Lấy danh sách tất cả thống kê
 */
export const getAllPerformanceMetricsController = async (req, res) => {
  try {
    const result = await performanceMetricService.getAllPerformanceMetricsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách thống kê hiệu suất thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllPerformanceMetricsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê theo user và tháng
 */
export const getPerformanceMetricByUserAndMonthController = async (req, res) => {
  try {
    const { userId, month } = req.params;
    const result = await performanceMetricService.getPerformanceMetricByUserAndMonthService(userId, month);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê hiệu suất thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getPerformanceMetricByUserAndMonthController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo thống kê
 */
export const createPerformanceMetricController = async (req, res) => {
  try {
    const result = await performanceMetricService.createPerformanceMetricService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo thống kê hiệu suất thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createPerformanceMetricController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật thống kê
 */
export const updatePerformanceMetricController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await performanceMetricService.updatePerformanceMetricService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật thống kê hiệu suất thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updatePerformanceMetricController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
