import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Lấy danh sách tất cả lịch sử với filters và pagination
 */
export const getFilteredWorkHistoriesService = async (filters, pagination) => {
  try {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (filters.action) whereClause.action = filters.action;
    if (filters.field_changed) whereClause.field_changed = { [Op.iLike]: `%${filters.field_changed}%` };
    if (filters.changed_by) whereClause.changed_by = filters.changed_by;
    if (filters.work_id) whereClause.work_id = filters.work_id;
    if (filters.date_from || filters.date_to) {
      whereClause.changed_at = {};
      if (filters.date_from) whereClause.changed_at[Op.gte] = new Date(filters.date_from);
      if (filters.date_to) whereClause.changed_at[Op.lte] = new Date(filters.date_to);
    }

    const { count, rows: histories } = await db.WorkHistory.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "changedByUser" },
      ],
      order: [["changed_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: histories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    logger.error("Error in getFilteredWorkHistoriesService:", error.message);
    throw error;
  }
};

/**
 * Lấy lịch sử theo work ID với pagination
 */
export const getWorkHistoryByWorkIdService = async (workId, pagination) => {
  try {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows: histories } = await db.WorkHistory.findAndCountAll({
      where: { work_id: workId },
      include: [{ model: db.User, as: "changedByUser" }],
      order: [["changed_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: histories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    logger.error("Error in getWorkHistoryByWorkIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo mới lịch sử công việc
 */
export const createWorkHistoryService = async (historyData) => {
  try {
    const history = await db.WorkHistory.create(historyData);
    return { success: true, data: history };
  } catch (error) {
    logger.error("Error in createWorkHistoryService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật ghi chú cho lịch sử
 */
export const updateWorkHistoryNotesService = async (id, notes) => {
  try {
    const [updatedRowsCount] = await db.WorkHistory.update(
      { notes },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      throw new Error("Work history not found");
    }

    const updatedHistory = await db.WorkHistory.findByPk(id);
    return { success: true, data: updatedHistory };
  } catch (error) {
    logger.error("Error in updateWorkHistoryNotesService:", error.message);
    throw error;
  }
};

/**
 * Xóa lịch sử công việc
 */
export const deleteWorkHistoryService = async (id) => {
  try {
    const deletedRowsCount = await db.WorkHistory.destroy({ where: { id } });

    if (deletedRowsCount === 0) {
      throw new Error("Work history not found");
    }

    return { success: true };
  } catch (error) {
    logger.error("Error in deleteWorkHistoryService:", error.message);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả lịch sử (deprecated, use getFilteredWorkHistoriesService)
 */
export const getAllWorkHistoriesService = async () => {
  return getFilteredWorkHistoriesService({}, { page: 1, limit: 1000 });
};
