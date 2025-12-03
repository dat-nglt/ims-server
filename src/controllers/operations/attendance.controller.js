import logger from "../../utils/logger.js";
import * as attendanceService from "../../services/operations/attendance.service.js";

/**
 * Lấy dữ liệu tổng quan chấm công
 */
export const getAttendanceSummaryController = async (req, res) => {
  try {
    const { start_date, end_date, department_id, employee_id } = req.query;

    // Parse và validate date an toàn
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(); // Fallback to today
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed; // Check if valid date
    };

    const params = {
      startDate: parseDate(start_date),
      endDate: parseDate(end_date),
      departmentId: department_id,
      employeeId: employee_id
    };

    const result = await attendanceService.getAttendanceSummaryService(params);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy dữ liệu tổng quan chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceSummaryController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê chấm công
 */
export const getAttendanceStatisticsController = async (req, res) => {
  try {
    const { start_date, end_date, department_id, employee_id } = req.query;

    // Parse và validate date an toàn
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(); // Fallback to today
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date() : parsed; // Check if valid date
    };

    const params = {
      startDate: parseDate(start_date),
      endDate: parseDate(end_date),
      departmentId: department_id,
      employeeId: employee_id
    };

    const result = await attendanceService.getAttendanceStatisticsService(params);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê chấm công thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getAttendanceStatisticsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
