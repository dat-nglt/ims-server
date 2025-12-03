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
        logger.error(
            "Error in getAllPerformanceMetricsService:",
            error.message
        );
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
