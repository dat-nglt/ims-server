import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import axios from "axios";
import { Op } from "sequelize";

/**
 * Lấy thông tin profile của kỹ thuật viên thông qua Zalo ID
 */
export const getProfileInfoService = async (ZAID) => {
  try {
    if (!ZAID) {
      throw new Error("Zalo ID không được để trống");
    }

    const technician = await db.User.findOne({
      where: { zalo_id: ZAID },
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
              // attributes: ["id", "work_code", "title", "status", "priority", "required_date"],
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
    logger.error(`Error in getProfileInfoService with ZAID ${ZAID}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const getListOfWorkAssignmentsService = async (ZAID, isToday = false) => {
  try {
    if (!ZAID) {
      throw new Error("Zalo ID không được để trống");
    }

    // Tìm user theo Zalo ID
    const technician = await db.User.findOne({
      where: { zalo_id: ZAID },
      attributes: ["id"],
    });

    if (!technician) {
      throw new Error("Không tìm thấy thông tin kỹ thuật viên");
    }

    // Lấy ngày hôm nay (sử dụng UTC)

    // Xây dựng điều kiện where dựa trên tham số isToday
    const whereCondition = {
      technician_id: technician.id,
    };

    if (isToday) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);
      whereCondition["$work.required_date$"] = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // Truy vấn danh sách các assignments liên quan đến kỹ thuật viên
    const assignments = await db.WorkAssignment.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "work_id",
        "technician_id",
        // "assigned_by",
        // "assignment_date",
        "assigned_status",
        "accepted_at",
        "rejected_reason",
        "estimated_start_time",
        "estimated_end_time",
        "actual_start_time",
        "actual_end_time",
        "notes",
        "created_at",
        // "updated_at",
      ],
      include: [
        {
          model: db.Work,
          as: "work",
          attributes: [
            "id",
            "work_code",
            "title",
            "description",
            "notes",
            // "category_id",
            "project_id",
            "created_by",
            "priority",
            "status",
            "service_type",
            // "due_date",
            "required_date",
            "required_time_hour",
            "required_time_minute",
            // "timeSlot",
            "created_date",
            "completed_date",
            "location",
            "customer_name",
            "customer_phone",
            "customer_address",
            "customer_id",
            "location_lat",
            "location_lng",
            "estimated_hours",
            "actual_hours",
            "estimated_cost",
            "actual_cost",
            "payment_status",
            // "created_at",
            // "updated_at",
          ],
          include: [
            {
              model: db.WorkCategory,
              as: "category",
              attributes: ["id", "name"],
            },
            {
              model: db.WorkAssignment,
              as: "assignments",
              attributes: ["id"],
              include: [
                {
                  model: db.User,
                  as: "technician",
                  attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
                },
              ],
              order: [["assignment_date", "DESC"]],
            },
          ],
        },
        {
          model: db.User,
          as: "assignedByUser",
          attributes: ["id", "name", "phone"],
        },
      ],
      order: [["assignment_date", "DESC"]],
      subQuery: false,
    });

    return { success: true, data: assignments };
  } catch (error) {
    logger.error(`Error in getListOfWorkAssignmentsService with ZAID ${ZAID}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const decodeLocationByTokenService = async (locationToken, accessToken) => {
  try {
    if (!locationToken) {
      throw new Error("Location token không được để trống");
    }

    const zaloSecretKey = process.env.ZALO_SECRET_KEY || null;

    if (!accessToken || !zaloSecretKey) {
      throw new Error("Zalo configuration không đầy đủ");
    }

    // Gọi Zalo Graph API endpoint để decode location token
    const endpoint = "https://graph.zalo.me/v2.0/me/info";

    const response = await axios.get(endpoint, {
      headers: {
        access_token: accessToken,
        code: locationToken,
        secret_key: zaloSecretKey,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    logger.error(`Error in decodeLocationByTokenService with token ${locationToken}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const getAttendanceLocationService = async () => {
  try {
    const locations = await db.AttendanceLocation.findAll({
      where: {
        is_active: true,
      },
      attributes: [
        "id",
        "location_code",
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "radius",
        "icon",
        "notes",
        "created_at",
        "updated_at",
      ],
      order: [["name", "DESC"]],
    });

    if (!locations || locations.length === 0) {
      return { success: true, data: [] };
    }

    return { success: true, data: locations };
  } catch (error) {
    logger.error(`Error in getAttendanceLocationService: ${error.message}`);
    return { success: false, error: error.message };
  }
};
