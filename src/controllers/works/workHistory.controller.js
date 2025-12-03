import logger from "../../utils/logger.js";
import * as workHistoryService from "../../services/works/index.js";

/**
 * Tạo mới lịch sử công việc (for automatic logging)
 */
export const createWorkHistoryController = async (req, res) => {
  try {
    const historyData = req.body;
    const result = await workHistoryService.createWorkHistoryService(historyData);

    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkHistoryController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
