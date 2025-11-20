import logger from "../utils/logger.js";
import * as workHistoryService from "../services/workHistory.service.js";

/**
 * Lấy danh sách tất cả lịch sử
 */
export const getAllWorkHistoriesController = async (req, res) => {
  try {
    const result = await workHistoryService.getAllWorkHistoriesService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllWorkHistoriesController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy lịch sử theo work ID
 */
export const getWorkHistoryByWorkIdController = async (req, res) => {
  try {
    const { workId } = req.params;
    const result = await workHistoryService.getWorkHistoryByWorkIdService(workId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkHistoryByWorkIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
