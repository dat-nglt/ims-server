import db from "../../models/index.js";

export const getAllAttendanceTypesService = async (options = { isSelection: false }) => {
  try {
    const { isSelection = false } = options || {};

    if (isSelection) {
      const attendanceTypes = await db.AttendanceType.findAll({
        where: { active: true },
        attributes: ["id", "name", "code"],
        order: [["name", "ASC"]],
      });
      return { success: true, data: attendanceTypes };
    }

    const attendanceTypes = await db.AttendanceType.findAll({
      where: { active: true },
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["created_at", "updated_at", "notes"] },
    });
    return { success: true, data: attendanceTypes };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
