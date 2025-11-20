import logger from "../../utils/logger.js";
import * as salesReportService from "../../services/IMS/salesReport.service.js";

/**
 * Lấy danh sách tất cả báo cáo
 */
export const getAllSalesReportsController = async (req, res) => {
  try {
    const result = await salesReportService.getAllSalesReportsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách báo cáo bán hàng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllSalesReportsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy báo cáo theo ID
 */
export const getSalesReportByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await salesReportService.getSalesReportByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin báo cáo bán hàng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getSalesReportByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo báo cáo
 */
export const createSalesReportController = async (req, res) => {
  try {
    const result = await salesReportService.createSalesReportService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo báo cáo bán hàng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createSalesReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật báo cáo
 */
export const updateSalesReportController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await salesReportService.updateSalesReportService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật báo cáo bán hàng thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateSalesReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Lấy báo cáo theo khoảng thời gian
 */
export const getSalesReportsByDateRangeController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await salesReportService.getSalesReportsByDateRangeService(startDate, endDate);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy báo cáo bán hàng theo khoảng thời gian thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getSalesReportsByDateRangeController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
