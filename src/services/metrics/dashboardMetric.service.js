import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách thống kê dashboard
 */
export const getAllDashboardMetricsService = async () => {
  try {
    const metrics = await db.DashboardMetric.findAll({
      include: [{ model: db.User, as: "user" }],
      order: [["metric_date", "DESC"]],
    });

    return { success: true, data: metrics };
  } catch (error) {
    logger.error("Error in getAllDashboardMetricsService:", error.message);
    throw error;
  }
};

/**
 * Lấy thống kê cho user
 */
export const getDashboardMetricsByUserIdService = async (userId) => {
  try {
    const metrics = await db.DashboardMetric.findAll({
      where: { user_id: userId },
      order: [["metric_date", "DESC"]],
    });

    return { success: true, data: metrics };
  } catch (error) {
    logger.error(
      "Error in getDashboardMetricsByUserIdService:",
      error.message
    );
    throw error;
  }
};

/**
 * Lấy thống kê theo ngày
 */
export const getDashboardMetricsByDateService = async (date) => {
  try {
    const metrics = await db.DashboardMetric.findAll({
      where: db.sequelize.where(
        db.sequelize.fn("DATE", db.sequelize.col("metric_date")),
        "=",
        date
      ),
      include: [{ model: db.User, as: "user" }],
    });

    return { success: true, data: metrics };
  } catch (error) {
    logger.error("Error in getDashboardMetricsByDateService:", error.message);
    throw error;
  }
};
