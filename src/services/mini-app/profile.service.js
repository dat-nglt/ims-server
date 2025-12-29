import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy thông tin profile của kỹ thuật viên thông qua Zalo ID
 */
export const getProfileInfoService = async (UID) => {
  try {
    if (!UID) {
      throw new Error("Zalo ID không được để trống");
    }

    const technician = await db.User.findOne({
      where: { zalo_id: UID },
      include: [
        {
          model: db.EmployeeProfile,
          as: "profile",
          include: [{ model: db.Department, as: "departmentInfo", attributes: ["id", "name", "code"] }],
        },
        {
          model: db.Position,
          as: "position",
          attributes: ["id", "name", "code"],
        },
        {
          model: db.WorkAssignment,
          as: "assignments",
          include: [
            {
              model: db.Work,
              as: "work",
              attributes: ["id", "work_code", "title", "status", "priority", "required_date"],
            },
          ],
        },
        {
          model: db.WorkReport,
          as: "reports",
          attributes: ["id", "work_id", "status", "progress_percentage", "reported_at"],
        },
      ],
      attributes: ["id", "name", "email", "phone", "zalo_id", "status", "approved", "avatar_url"],
    });

    if (!technician) {
      throw new Error("Không tìm thấy thông tin kỹ thuật viên");
    }

    return { success: true, data: technician };
  } catch (error) {
    logger.error(`Error in getProfileInfoService with UID ${UID}: ${error.message}`);
    return { success: false, error: error.message };
  }
};
