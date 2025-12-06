import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Lấy dữ liệu tổng quan chấm công theo khoảng thời gian (tương tự mock data trong AttendanceSummary.jsx)
 * @param {Object} params - { startDate, endDate, departmentId, employeeId }
 * @returns {Array} - Mảng nhân viên với dates object
 */
export const getAttendanceSummaryService = async (params) => {
  try {
    const { startDate, endDate, departmentId, employeeId } = params;

    // Validate date objects
    if (!(startDate instanceof Date) || isNaN(startDate.getTime()) ||
        !(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date parameters");
    }

    // Query CheckIn với include User (loại bỏ Department nếu chưa có model)
    const checkIns = await db.CheckIn.findAll({
      where: {
        check_in_time: {
          [Op.between]: [startDate, endDate],
        },
        ...(employeeId && { user_id: employeeId }),
      },
      include: [
        {
          model: db.User,
          as: "user",
          where: departmentId ? { department_id: departmentId } : {}, // Giả sử User có department_id
          // Loại bỏ include Department để tránh lỗi
        },
      ],
      order: [["check_in_time", "ASC"]],
    });

    // Tổng hợp dữ liệu theo user_id và ngày
    const summaryMap = {};
    checkIns.forEach((checkIn) => {
      const user = checkIn.user;
      const dateStr = checkIn.check_in_time.toISOString().split("T")[0]; // YYYY-MM-DD
      const userId = user.id;

      if (!summaryMap[userId]) {
        summaryMap[userId] = {
          id: userId,
          name: user.name,
          department: user.department || "N/A", // Giả sử User có trường department trực tiếp
          dates: {},
        };
      }

      // Xác định status dựa trên logic
      let status = "absent";
      if (checkIn.status === "on_leave") {
        status = "sick";
      } else if (checkIn.check_in_time && checkIn.check_out_time) {
        const checkInHour = checkIn.check_in_time.getHours();
        status = checkInHour > 8 ? "late" : "present";
      }

      // Tính duration (giờ:phút)
      const durationMinutes = checkIn.duration_minutes || 0;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      const duration = `${hours}h ${minutes}m`;

      // Location
      const location = checkIn.is_within_radius ? "✓" : "⚠";

      // Check-in/out time
      const checkInTime = checkIn.check_in_time.toTimeString().substring(0, 5);
      const checkOutTime = checkIn.check_out_time ? checkIn.check_out_time.toTimeString().substring(0, 5) : null;

      summaryMap[userId].dates[dateStr] = {
        status,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        duration,
        location,
      };
    });

    // Chuyển thành array và thêm ngày trống nếu cần (absent)
    const summary = Object.values(summaryMap);
    // (Tùy chọn: Thêm logic để fill absent cho ngày không có bản ghi, nhưng mock không có, nên bỏ qua để tối ưu)

    return { success: true, data: summary };
  } catch (error) {
    logger.error("Error in getAttendanceSummaryService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thống kê chấm công (tương tự stats trong AttendanceSummary.jsx)
 * @param {Object} params - { startDate, endDate, departmentId, employeeId }
 * @returns {Object} - { totalPresent, totalLate, totalAbsent, totalSick }
 */
export const getAttendanceStatisticsService = async (params) => {
  try {
    const summary = await getAttendanceSummaryService(params);
    const stats = { totalPresent: 0, totalLate: 0, totalAbsent: 0, totalSick: 0 };

    summary.data.forEach((person) => {
      Object.values(person.dates).forEach((record) => {
        if (record.status === "present") stats.totalPresent++;
        else if (record.status === "late") stats.totalLate++;
        else if (record.status === "absent") stats.totalAbsent++;
        else if (record.status === "sick") stats.totalSick++;
      });
    });

    return { success: true, data: stats };
  } catch (error) {
    logger.error("Error in getAttendanceStatisticsService:" + error.message);
    throw error;
  }
};
