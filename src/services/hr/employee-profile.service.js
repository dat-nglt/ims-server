import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả hồ sơ
 * SQL: SELECT ep.*, u.* FROM employee_profiles ep LEFT JOIN users u ON ep.user_id = u.id WHERE ep.is_active = true;
 */
export const getAllEmployeeProfilesService = async () => {
    try {
        const profiles = await db.EmployeeProfile.findAll({
            where: { is_active: true }, // Filter active profiles
            include: [{ model: db.User, as: "user" }],
        });

        return { success: true, data: profiles };
    } catch (error) {
        logger.error("Error in getAllEmployeeProfilesService:" + error.message);
        throw error;
    }
};

/**
 * Lấy hồ sơ theo user ID (sử dụng employee_id từ User)
 * SQL: SELECT u.*, ep.* FROM users u LEFT JOIN employee_profiles ep ON u.id = ep.user_id WHERE u.employee_id = ? AND u.is_active = true AND ep.is_active = true;
 */
export const getEmployeeProfileByUserIdService = async (employeeId) => {
    try {
        // Find active user by employee_id and include the linked profile with attendances and assigned works
        const user = await db.User.findOne({
            where: { employee_id: employeeId, is_active: true }, // Filter active users by employee_id
            include: [
                {
                    model: db.EmployeeProfile,
                    as: "profile",
                    where: { is_active: true }, // Ensure profile is active
                    required: true, // Inner join to ensure profile exists
                },
                { model: db.Attendance, as: "attendances" },
                { model: db.Work, as: "assignedWorks" },
            ],
        });

        console.log(user.profile);

        if (!user) {
            throw new Error("Hồ sơ nhân viên không tồn tại");
        }

        // Calculate additional fields based on EmployeeDetail.jsx requirements
        const totalWorkDays = user.attendances ? user.attendances.length : 0;
        const totalWorks = user.assignedWorks ? user.assignedWorks.length : 0;
        const totalSalary = totalWorkDays * (user.profile.dailySalary || 0);

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

        console.log(user);

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
            throw new Error("Hồ sơ nhân viên không tồn tại");
        }

        // Optional: Add field validation here if needed (e.g., performance_rating between 1-5)

        await profile.update({
            ...updateData,
            updated_at: new Date(),
        });

        return { success: true, data: profile };
    } catch (error) {
        logger.error("Error in updateEmployeeProfileService:" + error.message);
        throw error;
    }
};
