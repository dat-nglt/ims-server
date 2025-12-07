import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Tạo mới lịch sử dự án (for automatic logging)
 */
export const createProjectHistoryService = async (historyData) => {
  try {
    // Check if project exists
    const project = await db.Project.findByPk(historyData.project_id);
    if (!project) {
      throw new Error("Dự án không tồn tại");
    }

    // Check if changed_by exists
    const user = await db.User.findByPk(historyData.changed_by);
    if (!user) {
      throw new Error("Người thay đổi không tồn tại");
    }

    const history = await db.ProjectHistory.create(historyData);
    return { success: true, data: history };
  } catch (error) {
    logger.error("Error in createProjectHistoryService:" + error.message);
    throw error;
  }
};

/**
 * Lấy tất cả lịch sử của một dự án
 */
export const getAllProjectHistoriesService = async (projectId) => {
  try {
    // Check if project exists
    const project = await db.Project.findByPk(projectId);
    if (!project) {
      throw new Error("Dự án không tồn tại");
    }

    const histories = await db.ProjectHistory.findAll({
      where: { project_id: projectId },
      include: [
        { model: db.User, as: "changedByUser", attributes: ["name"] },
      ],
      order: [["changed_at", "DESC"]],
    });

    return { success: true, data: histories };
  } catch (error) {
    logger.error("Error in getAllProjectHistoriesService:" + error.message);
    throw error;
  }
};
