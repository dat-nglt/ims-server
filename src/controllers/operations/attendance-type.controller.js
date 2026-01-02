import logger from "../../utils/logger.js";
import * as attendanceService from "../../services/operations/attendance-type.service.js";

/**
 * Lấy danh sách tất cả attendance types
 */
export const getAllAttendanceTypesController = async (req, res) => {
  try {
    const result = await attendanceService.getAllAttendanceTypesService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getAllAttendanceController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
