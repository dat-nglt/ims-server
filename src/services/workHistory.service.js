import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả lịch sử
 */
export const getAllWorkHistoriesService = async () => {
  try {
    const histories = await db.WorkHistory.findAll({
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "changedByUser" },
      ],
      order: [["changed_at", "DESC"]],
    });

    return { success: true, data: histories };
  } catch (error) {
    logger.error("Error in getAllWorkHistoriesService:", error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử theo work ID
 */
export const getWorkHistoryByWorkIdService = async (workId) => {
  try {
    const histories = await db.WorkHistory.findAll({
      where: { work_id: workId },
      include: [{ model: db.User, as: "changedByUser" }],
      order: [["changed_at", "DESC"]],
    });

    return { success: true, data: histories };
  } catch (error) {
    logger.error("Error in getWorkHistoryByWorkIdService:", error.message);
    throw error;
  }
};
