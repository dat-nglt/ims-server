import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả thống kê
 */
export const getAllPerformanceMetricsService = async () => {
  try {
    const metrics = await db.PerformanceMetric.findAll({
      include: [{ model: db.User, as: "user" }],
      order: [["month", "DESC"]],
    });

    return { success: true, data: metrics };
  } catch (error) {
    logger.error("Error in getAllPerformanceMetricsService:", error.message);
    throw error;
  }
};

/**
 * Lấy thống kê theo user và tháng
 */
export const getPerformanceMetricByUserAndMonthService = async (
  userId,
  month
) => {
  try {
    const metric = await db.PerformanceMetric.findOne({
      where: {
        user_id: userId,
        month: new Date(month),
      },
      include: [{ model: db.User, as: "user" }],
    });

    if (!metric) {
      throw new Error("Thống kê hiệu suất không tồn tại");
    }

    return { success: true, data: metric };
  } catch (error) {
    logger.error(
      "Error in getPerformanceMetricByUserAndMonthService:",
      error.message
    );
    throw error;
  }
};

/**
 * Tạo thống kê
 */
export const createPerformanceMetricService = async (metricData) => {
  try {
    const { user_id, month } = metricData;

    if (!user_id || !month) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const metric = await db.PerformanceMetric.create({
      ...metricData,
      month: new Date(month),
    });

    return { success: true, data: metric };
  } catch (error) {
    logger.error("Error in createPerformanceMetricService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật thống kê
 */
export const updatePerformanceMetricService = async (id, updateData) => {
  try {
    const metric = await db.PerformanceMetric.findByPk(id);
    if (!metric) {
      throw new Error("Thống kê hiệu suất không tồn tại");
    }

    await metric.update(updateData);

    return { success: true, data: metric };
  } catch (error) {
    logger.error("Error in updatePerformanceMetricService:", error.message);
    throw error;
  }
};
