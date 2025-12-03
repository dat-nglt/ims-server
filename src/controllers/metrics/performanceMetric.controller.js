import logger from "../../utils/logger.js";
import * as performanceMetricService from "../../services/metrics/index.js";

/**
 * Lấy danh sách tất cả thống kê
 */
export const getAllPerformanceMetricsController = async (req, res) => {
    try {
        const result =
            await performanceMetricService.getAllPerformanceMetricsService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách thống kê hiệu suất thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllPerformanceMetricsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy thống kê theo user và tháng
 */
export const getPerformanceMetricByUserAndMonthController = async (
    req,
    res
) => {
    try {
        const { userId, month } = req.params;
        const result =
            await performanceMetricService.getPerformanceMetricByUserAndMonthService(
                userId,
                month
            );
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thống kê hiệu suất thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getPerformanceMetricByUserAndMonthController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};
