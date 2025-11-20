import logger from "../../utils/logger.js";
import * as dashboardMetricService from "../../services/IMS/dashboardMetric.service.js";

/**
 * Lấy danh sách thống kê dashboard
 */
export const getAllDashboardMetricsController = async (req, res) => {
  try {
    const result = await dashboardMetricService.getAllDashboardMetricsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách thống kê dashboard thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllDashboardMetricsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê cho user
 */
export const getDashboardMetricsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await dashboardMetricService.getDashboardMetricsByUserIdService(
      userId
    );
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê dashboard cho người dùng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getDashboardMetricsByUserIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê theo ngày
 */
export const getDashboardMetricsByDateController = async (req, res) => {
  try {
    const { date } = req.params;
    const result = await dashboardMetricService.getDashboardMetricsByDateService(
      date
    );
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê dashboard theo ngày thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getDashboardMetricsByDateController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
