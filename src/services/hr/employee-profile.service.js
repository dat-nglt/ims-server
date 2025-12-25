import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Sequelize } from "sequelize";

/**
 * Lấy danh sách tất cả hồ sơ
 * SQL: SELECT ep.*, u.*, d.*, pos.* FROM employee_profiles ep LEFT JOIN users u ON ep.user_id = u.id LEFT JOIN departments d ON ep.department_id = d.id LEFT JOIN positions pos ON u.position_id = pos.id WHERE ep.is_active = true;
 */
export const getAllEmployeeProfilesService = async () => {
  try {
    const profiles = await db.EmployeeProfile.findAll({
      where: { is_active: true }, // Filter active profiles
      include: [
        { model: db.User, as: "user" },
        {
          model: db.Department,
          as: "departmentInfo",
        },
      ],
    });

      console.log(profiles);
      
    // Manually add position info by fetching positions for each user
    const profilesWithPositions = await Promise.all(
      profiles.map(async (profile) => {
        if (profile.user && profile.user.position_id) {
          const position = await db.Position.findByPk(profile.user.position_id, {
            attributes: ["id", "name", "code", "level", "status"],
          });
          profile.user.setDataValue("positionInfo", position);
        }
        return profile;
      })
    );

    return { success: true, data: profilesWithPositions };
  } catch (error) {
    logger.error("Error in getAllEmployeeProfilesService:" + error.message);
    throw error;
  }
};

export const getAllEmployeeWithProfileService = async () => {
  try {
    const employees = await db.User.findAll({
      where: { is_active: true },
      include: [
        {
          model: db.EmployeeProfile,
          as: "profile",
          where: { is_active: true },
          required: true, // Only users that have an active profile
          include: [
            {
              model: db.Department,
              as: "departmentInfo",
              attributes: ["id", "name", "code", "status"],
            },
          ],
        },
        {
          model: db.Position,
          as: "position",
          attributes: ["id", "name", "code", "level", "status"],
        },
        { model: db.Attendance, as: "attendances" },
        { model: db.Work, as: "assignedWorks" },
      ],
    });

    // Compute derived fields for each user similar to getEmployeeProfileByUserIdService
    const usersWithTotals = employees.map((user) => {
      const profile = user.profile || {};
      const totalWorkDays = user.attendances ? user.attendances.length : 0;
      const totalWorks = user.assignedWorks ? user.assignedWorks.length : 0;
      const totalSalary = totalWorkDays * (profile.dailySalary || 0);

      user.setDataValue("totalWorkDays", totalWorkDays);
      user.setDataValue("totalWorks", totalWorks);
      user.setDataValue("totalSalary", totalSalary);

      return user;
    });

    return { success: true, data: usersWithTotals };
  } catch (error) {
    logger.error("Error in getAllEmployeeWithProfileService:" + error.message);
    throw error;
  }
};

/**
 * Lấy hồ sơ theo user ID (sử dụng employee_id từ User)
 * SQL: SELECT u.*, ep.*, d.*, pos.* FROM users u LEFT JOIN employee_profiles ep ON u.id = ep.user_id LEFT JOIN departments d ON ep.department_id = d.id LEFT JOIN positions pos ON u.position_id = pos.id WHERE u.employee_id = ? AND u.is_active = true AND (ep.is_active = true OR ep.is_active IS NULL);
 */
export const getEmployeeProfileByUserIdService = async (employeeId) => {
  try {
    // Find active user by employee_id and include the linked profile with attendances, assigned works, roles, department and position
    const user = await db.User.findOne({
      where: { employee_id: employeeId, is_active: true }, // Filter active users by employee_id
      include: [
        {
          model: db.EmployeeProfile,
          as: "profile",
          where: { is_active: true }, // Ensure profile is active
          required: false, // Left join to allow users without profiles
          include: [
            {
              model: db.Department,
              as: "departmentInfo",
              attributes: ["id", "name", "code", "status"],
            },
          ],
        },
        {
          model: db.Position,
          as: "position",
          attributes: ["id", "name", "code", "level", "status"],
        },
        { model: db.Attendance, as: "attendances" },
        { model: db.Work, as: "assignedWorks" },
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [
            {
              model: db.Role,
              as: "role",
              include: [
                {
                  model: db.Permission,
                  as: "permissions",
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // If no profile, set default values
    const profile = user.profile || {};
    const totalWorkDays = user.attendances ? user.attendances.length : 0;
    const totalWorks = user.assignedWorks ? user.assignedWorks.length : 0;
    const totalSalary = totalWorkDays * (profile.dailySalary || 0);

    // Normalize approval status
    const normalizeApproval = (val) => {
      if (val === true) return "approved";
      if (val === false) return "rejected";
      if (typeof val === "string") {
        const s = val.toLowerCase();
        if (["approved", "pending", "rejected"].includes(s)) return s;
      }
      return "pending";
    };

    // Add calculated fields to the profile instance
    user.setDataValue("totalWorkDays", totalWorkDays);
    user.setDataValue("totalWorks", totalWorks);
    user.setDataValue("totalSalary", totalSalary);

    return { success: true, data: user };
  } catch (error) {
    logger.error("Error in getEmployeeProfileByUserIdService:" + error.message);
    throw error;
  }
};

/**
 * Tạo hồ sơ
 * SQL: INSERT INTO employee_profiles (user_id, department, specialization, certification, phone_secondary, address, date_of_birth, gender, id_number, hire_date, total_experience_years, performance_rating, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW());
 */
export const createEmployeeProfileService = async (profileData) => {
  try {
    const { user_id } = profileData;

    if (!user_id) {
      throw new Error("user_id là bắt buộc");
    }

    // Kiểm tra người dùng tồn tại và active
    const user = await db.User.findByPk(user_id);
    if (!user || !user.is_active) {
      throw new Error("Người dùng không tồn tại hoặc không hoạt động");
    }

    // Kiểm tra hồ sơ đã tồn tại cho user này
    const existingProfile = await db.EmployeeProfile.findOne({
      where: { user_id },
    });
    if (existingProfile) {
      throw new Error("Hồ sơ nhân viên đã tồn tại cho người dùng này");
    }

    const profile = await db.EmployeeProfile.create({
      ...profileData,
      is_active: true, // Ensure new profiles are active
    });

    return { success: true, data: profile };
  } catch (error) {
    logger.error("Error in createEmployeeProfileService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật hồ sơ
 * SQL: UPDATE employee_profiles SET department = ?, specialization = ?, certification = ?, phone_secondary = ?, address = ?, date_of_birth = ?, gender = ?, id_number = ?, hire_date = ?, total_experience_years = ?, performance_rating = ?, updated_at = NOW() WHERE user_id = ? AND is_active = true;
 */
export const updateEmployeeProfileService = async (userId, updateData) => {
  try {
    const profile = await db.EmployeeProfile.findOne({
      where: { user_id: userId, is_active: true }, // Filter active profiles
    });

    if (!profile) {
      return { success: false, message: "Hồ sơ nhân viên không tồn tại" };
    }

    // Allowed fields that can be updated on the profile
    const allowedFields = [
      "department_id",
      "specialization",
      "certification",
      "phone_secondary",
      "address",
      "date_of_birth",
      "gender",
      "id_number",
      "hire_date",
      "contract_date",
      "bank_account_number",
      "bank_name",
      "total_experience_years",
      "performance_rating",
      "dailySalary",
      "is_active",
    ];

    const payload = {};

    // Sanitize & normalize incoming values
    for (const key of allowedFields) {
      if (typeof updateData[key] === "undefined") continue;
      let val = updateData[key];

      // Date fields: normalize to Date objects or null
      if (["date_of_birth", "hire_date", "contract_date"].includes(key)) {
        if (!val) {
          payload[key] = null;
          continue;
        }
        // Accept Date or ISO string; fall back to null for invalid values
        const d = new Date(val);
        if (isNaN(d.getTime())) {
          logger.warn(`Invalid date for ${key}: ${val}; setting to null`);
          payload[key] = null;
        } else {
          payload[key] = d;
        }
        continue;
      }

      // List fields: accept array or comma-separated string
      if (["specialization", "certification"].includes(key)) {
        if (Array.isArray(val)) payload[key] = val;
        else if (typeof val === "string")
          payload[key] = val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        else payload[key] = [];
        continue;
      }

      // Numeric fields
      if (["dailySalary", "performance_rating", "total_experience_years", "department_id"].includes(key)) {
        const num = Number(val);
        payload[key] = isNaN(num) ? null : num;
        continue;
      }

      // Default: copy through
      payload[key] = val;
    }

    await profile.update({
      ...payload,
      updated_at: new Date(),
    });

    // Fetch updated user with complete relations (department, position, attendances, etc.)
    const updatedUser = await db.User.findByPk(userId, {
      include: [
        {
          model: db.EmployeeProfile,
          as: "profile",
          include: [
            {
              model: db.Department,
              as: "departmentInfo",
              attributes: ["id", "name", "code", "status"],
            },
          ],
        },
        {
          model: db.Position,
          as: "position",
          attributes: ["id", "name", "code", "level", "status"],
        },
        { model: db.Attendance, as: "attendances" },
        { model: db.Work, as: "assignedWorks" },
      ],
    });

    if (!updatedUser) {
      return { success: false, message: "Không thể lấy lại thông tin người dùng sau cập nhật" };
    }

    // Calculate derived fields
    const updatedProfile = updatedUser.profile || {};
    const totalWorkDays = updatedUser.attendances ? updatedUser.attendances.length : 0;
    const totalWorks = updatedUser.assignedWorks ? updatedUser.assignedWorks.length : 0;
    const totalSalary = totalWorkDays * (updatedProfile.dailySalary || 0);

    // Add calculated fields to response
    updatedUser.setDataValue("totalWorkDays", totalWorkDays);
    updatedUser.setDataValue("totalWorks", totalWorks);
    updatedUser.setDataValue("totalSalary", totalSalary);

    return { success: true, data: updatedUser };
  } catch (error) {
    logger.error("Error in updateEmployeeProfileService:" + error.message);
    return { success: false, message: error.message };
  }
};
