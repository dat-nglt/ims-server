import db from "../../models/index.js";

export const getAllAttendanceTypesService = async () => {
  try {
    const attendanceTypes = await db.AttendanceType.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["created_at", "updated_at", "notes"] },
    }); 
    return { success: true, data: attendanceTypes };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
