import logger from "../../utils/logger.js";
import * as workReportService from "../../services/works/index.js";

/**
 * Lấy danh sách tất cả báo cáo công việc
 */
export const getAllWorkReportsController = async (req, res) => {
  try {
    const result = await workReportService.getAllWorkReportsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách báo cáo công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllWorkReportsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy báo cáo công việc theo ID
 */
export const getWorkReportByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workReportService.getWorkReportByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin báo cáo thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkReportByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo báo cáo công việc
 */
export const createWorkReportController = async (req, res) => {
  try {
    const result = await workReportService.createWorkReportService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo báo cáo công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật báo cáo công việc
 */
export const updateWorkReportController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workReportService.updateWorkReportService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật báo cáo công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateWorkReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Phê duyệt báo cáo công việc
 */
export const approveWorkReportController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workReportService.approveWorkReportService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Phê duyệt báo cáo thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in approveWorkReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Từ chối báo cáo công việc
 */
export const rejectWorkReportController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workReportService.rejectWorkReportService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Từ chối báo cáo thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in rejectWorkReportController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
