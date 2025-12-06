import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import axios from "axios";
import { Op } from "sequelize";

/**
 * Lấy danh sách tất cả check-in
 */
export const getAllCheckInsService = async () => {
    try {
        const checkIns = await db.CheckIn.findAll({
            include: [
                { model: db.User, as: "user" },
                { model: db.Work, as: "work" },
            ],
        });
        return { success: true, data: checkIns };
    } catch (error) {
        logger.error("Error in getAllCheckInsService:" + error.message);
        throw error;
    }
};

/**
 * Lấy thông tin toạ độ (chưa triển khai)
 */
export const getLocationService = async (accessToken, code) => {
    try {
        const secretKey = process.env.ZALO_SECRET_KEY;
        const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
            headers: {
                access_token: accessToken,
                code: code,
                secret_key: secretKey,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        logger.error("Error in getLocationService:" + error.message);
        throw error;
    }
};

/**
 * Lấy check-in theo ID
 */
export const getCheckInByIdService = async (id) => {
    try {
        const checkIn = await db.CheckIn.findByPk(id, {
            include: [
                { model: db.User, as: "user" },
                { model: db.Work, as: "work" },
            ],
        });
        if (!checkIn) {
            throw new Error("Check-in không tồn tại");
        }
        return { success: true, data: checkIn };
    } catch (error) {
        logger.error("Error in getCheckInByIdService:" + error.message);
        throw error;
    }
};

/**
 * Check-in người dùng
 */
export const checkInService = async (checkInData) => {
    try {
        const {
            user_id,
            work_id,
            project_id, // Thêm project_id nếu có trong data
            latitude,
            longitude,
            location_name,
            address,
            photo_url,
            device_info,
            ip_address,
            notes,
        } = checkInData;

        if (!user_id || !latitude || !longitude) {
            throw new Error("Thiếu thông tin bắt buộc");
        }

        // Kiểm tra user_id tồn tại
        const user = await db.User.findByPk(user_id);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }

        // Kiểm tra work_id tồn tại nếu có
        if (work_id) {
            const work = await db.Work.findByPk(work_id);
            if (!work) {
                throw new Error("Công việc không tồn tại");
            }
        }

        // Kiểm tra project_id tồn tại nếu có
        if (project_id) {
            const project = await db.Project.findByPk(project_id);
            if (!project) {
                throw new Error("Dự án không tồn tại");
            }
        }

        const checkIn = await db.CheckIn.create({
            user_id,
            work_id,
            project_id,
            check_in_time: new Date(),
            latitude,
            longitude,
            location_name,
            address,
            photo_url,
            status: "checked_in",
            device_info,
            ip_address,
            notes,
        });

        return { success: true, data: checkIn };
    } catch (error) {
        logger.error("Error in checkInService:" + error.message);
        throw error;
    }
};

/**
 * Check-out người dùng
 */
export const checkOutService = async (id) => {
    try {
        const checkIn = await db.CheckIn.findByPk(id);
        if (!checkIn) {
            throw new Error("Check-in không tồn tại");
        }

        if (checkIn.check_out_time) {
            throw new Error("Đã check-out rồi");
        }

        const checkOutTime = new Date();
        const durationMinutes = Math.round(
            (checkOutTime - checkIn.check_in_time) / 60000
        );

        await checkIn.update({
            check_out_time: checkOutTime,
            status: "checked_out",
            duration_minutes: durationMinutes,
        });

        return { success: true, data: checkIn };
    } catch (error) {
        logger.error("Error in checkOutService:" + error.message);
        throw error;
    }
};

/**
 * Lấy lịch sử check-in của một người dùng
 */
export const getCheckInHistoryByUserIdService = async (userId) => {
    try {
        const checkIns = await db.CheckIn.findAll({
            where: { user_id: userId },
            include: [{ model: db.Work, as: "work" }],
            order: [["check_in_time", "DESC"]],
        });

        return { success: true, data: checkIns };
    } catch (error) {
        logger.error(
            "Error in getCheckInHistoryByUserIdService:",
            error.message
        );
        throw error;
    }
};

/**
 * Lấy danh sách vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechniciansLocationsService = async ({
    includeOffline,
    includeHistory,
}) => {
    try {
        const whereClause = includeOffline ? '' : "AND lh.status != 'offline'";
        const locations = await db.sequelize.query(`
            SELECT lh.user_id, lh.latitude, lh.longitude, lh.status, lh.timestamp, u.name
            FROM location_histories lh
            INNER JOIN users u ON lh.user_id = u.id
            WHERE lh.timestamp = (
                SELECT MAX(timestamp)
                FROM location_histories
                WHERE user_id = lh.user_id
            ) ${whereClause}
            ORDER BY lh.timestamp DESC
        `, {
            type: db.sequelize.QueryTypes.SELECT
        });

        const data = locations.map((loc) => ({
            id: loc.user_id,
            name: loc.name,
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
            online: loc.status !== "offline",
            lastUpdate: loc.timestamp,
            status: loc.status,
        }));

        return { success: true, data };
    } catch (error) {
        logger.error("Error in getTechniciansLocationsService:" + error.message);
        throw error;
    }
};

/**
 * Lấy vị trí văn phòng (từ OfficeLocation)
 */
export const getOfficeLocationService = async () => {
    try {
        const office = await db.OfficeLocation.findOne({
            where: { type: "office", is_active: true },
        });

        if (!office) {
            throw new Error("Không tìm thấy vị trí văn phòng");
        }

        const data = {
            id: office.id,
            name: office.name,
            lat: parseFloat(office.latitude),
            lng: parseFloat(office.longitude),
            address: office.address,
            phone: office.phone,
            workingHours: office.working_hours,
        };

        return { success: true, data };
    } catch (error) {
        logger.error("Error in getOfficeLocationService:" + error.message);
        throw error;
    }
};

/**
 * Lấy lịch sử vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechnicianLocationHistoryService = async ({
    technicianId,
    startDate,
    endDate,
    limit,
}) => {
    try {
        const where = { user_id: technicianId };
        if (startDate && endDate) {
            where.timestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        const history = await db.LocationHistory.findAll({
            where,
            order: [["timestamp", "DESC"]],
            limit,
            attributes: ["latitude", "longitude", "timestamp", "status"],
        });

        const data = history.map((h) => ({
            lat: parseFloat(h.latitude),
            lng: parseFloat(h.longitude),
            timestamp: h.timestamp,
            status: h.status,
        }));

        return { success: true, data };
    } catch (error) {
        logger.error(
            "Error in getTechnicianLocationHistoryService:",
            error.message
        );
        throw error;
    }
};

/**
 * Lấy vị trí công việc (từ Work model)
 */
export const getJobItemsLocationsService = async ({
    status,
    includeArchived,
}) => {
    try {
        const where = {};
        if (status) where.status = status;
        if (!includeArchived) where.status = { [Op.ne]: "cancelled" };

        const works = await db.Work.findAll({
            where,
            attributes: [
                "id",
                "title",
                "location_lat",
                "location_lng",
                "status",
                "priority",
            ],
        });

        const data = works.map((work) => ({
            id: work.id,
            projectId: work.project_id,
            name: work.title,
            lat: parseFloat(work.location_lat),
            lng: parseFloat(work.location_lng),
            status: work.status,
            priority: work.priority,
            address: work.location || "",
        }));

        return { success: true, data };
    } catch (error) {
        logger.error("Error in getJobItemsLocationsService:" + error.message);
        throw error;
    }
};

/**
 * Xử lý geocoding reverse (gọi API bên ngoài, e.g., OpenStreetMap Nominatim)
 */
export const getGeocodingReverseService = async ({ lat, lng, language }) => {
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    format: "json",
                    lat,
                    lon: lng,
                    "accept-language": language,
                    zoom: 18,
                    addressdetails: 1,
                },
            }
        );

        const data = response.data;
        const result = {
            displayName: data.display_name,
            fullAddress: data.display_name,
            district: data.address?.county || data.address?.city_district,
            ward: data.address?.suburb || data.address?.neighbourhood,
            city: data.address?.city || data.address?.town,
            road: data.address?.road,
        };

        return { success: true, data: result };
    } catch (error) {
        logger.error("Error in getGeocodingReverseService:" + error.message);
        throw error;
    }
};
