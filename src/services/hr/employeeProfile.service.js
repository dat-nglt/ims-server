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
 * Lấy hồ sơ theo user ID
 * SQL: SELECT ep.*, u.* FROM employee_profiles ep LEFT JOIN users u ON ep.user_id = u.id WHERE ep.user_id = ? AND ep.is_active = true;
 */
export const getEmployeeProfileByUserIdService = async (userId) => {
    try {
        const profile = await db.EmployeeProfile.findOne({
            where: { user_id: userId, is_active: true }, // Filter active profiles
            include: [{ model: db.User, as: "user" }],
        });

        if (!profile) {
            throw new Error("Hồ sơ nhân viên không tồn tại");
        }

        return { success: true, data: profile };
    } catch (error) {
        logger.error(
            "Error in getEmployeeProfileByUserIdService:" + error.message
        );
        throw error;
    }
};

/**
 * Tạo hồ sơ
 * SQL: INSERT INTO employee_profiles (user_id, department, specialization, certification, phone_secondary, address, date_of_birth, gender, id_number, hire_date, total_experience_years, performance_rating, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW());
 */
export const createEmployeeProfileService = async (profileData) => {
    try {
        const { user_id, id } = profileData;

        if (!user_id) {
            throw new Error("user_id là bắt buộc");
        }

        if (!id) {
            throw new Error("id là bắt buộc");
        }

        // Validate ID format: IMS-LQD-{numbers}
        const idRegex = /^IMS-LQD-\d+$/;
        if (!idRegex.test(id)) {
            throw new Error("ID phải có định dạng IMS-LQD-{số}");
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

        // Kiểm tra ID đã tồn tại
        const existingId = await db.EmployeeProfile.findOne({
            where: { id },
        });
        if (existingId) {
            throw new Error("ID nhân viên đã tồn tại");
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
