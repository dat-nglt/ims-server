import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Tạo mới lịch sử công việc (for automatic logging)
 */
export const createWorkHistoryService = async (historyData) => {
  try {
    // Check if work exists
    const work = await db.Work.findByPk(historyData.work_id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Check if changed_by exists
    const user = await db.User.findByPk(historyData.changed_by);
    if (!user) {
      throw new Error("Người thay đổi không tồn tại");
    }

    const history = await db.WorkHistory.create(historyData);
    return { success: true, data: history };
  } catch (error) {
    logger.error("Error in createWorkHistoryService:" + error.message);
    throw error;
  }
};
