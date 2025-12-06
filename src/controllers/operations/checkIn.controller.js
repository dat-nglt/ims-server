import logger from "../../utils/logger.js";
import * as checkInService from "../../services/operations/index.js";

// export const getLocationController = async (req, res) => {
//     try {
//         const { access_token, code } = req.query;
//         const result = await checkInService.getLocationService(
//             access_token,
//             code
//         );
//         res.json({
//             status: "success",
//             data: result.data,
//             message: "Lấy thông tin vị trí thành công",
//         });
//     } catch (error) {
//         logger.error(
//             `[${req.id}] Error in getLocationController:`,
//             error.message
//         );
//         res.status(500).json({ error: error.message });
//     }
// };

/**
 * Lấy danh sách tất cả check-in
 */
export const getAllCheckInsController = async (req, res) => {
    try {
        const result = await checkInService.getAllCheckInsService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách check-in thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllCheckInsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy check-in theo ID
 */
export const getCheckInByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await checkInService.getCheckInByIdService(id);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin check-in thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getCheckInByIdController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Check-in người dùng
 */
export const checkInController = async (req, res) => {
    try {
        const result = await checkInService.checkInService(req.body);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Check-in thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in checkInController:` + error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Check-out người dùng
 */
export const checkOutController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await checkInService.checkOutService(id);
        res.json({
            status: "success",
            data: result.data,
            message: "Check-out thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in checkOutController:` + error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lấy lịch sử check-in của một người dùng
 */
export const getCheckInHistoryByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await checkInService.getCheckInHistoryByUserIdService(
            userId
        );

        res.json({
            status: "success",
            data: result.data,
            message: "Lấy lịch sử check-in thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getCheckInHistoryByUserIdController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy danh sách vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechniciansLocationsController = async (req, res) => {
    try {
        const { includeOffline, includeHistory } = req.query;
        const result = await checkInService.getTechniciansLocationsService({
            includeOffline: includeOffline === "true",
            includeHistory: includeHistory === "true",
        });
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy vị trí kỹ thuật viên thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getTechniciansLocationsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy vị trí văn phòng (từ OfficeLocation)
 */
export const getOfficeLocationController = async (req, res) => {
    try {
        const result = await checkInService.getOfficeLocationService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy vị trí văn phòng thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getOfficeLocationController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy lịch sử vị trí kỹ thuật viên (từ LocationHistory)
 */
export const getTechnicianLocationHistoryController = async (req, res) => {
    try {
        const { technicianId } = req.params;
        const { startDate, endDate, limit } = req.query;
        const result = await checkInService.getTechnicianLocationHistoryService(
            {
                technicianId: parseInt(technicianId),
                startDate,
                endDate,
                limit: limit ? parseInt(limit) : 100,
            }
        );
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy lịch sử vị trí thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getTechnicianLocationHistoryController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy vị trí công việc (từ Work model)
 */
export const getJobItemsLocationsController = async (req, res) => {
    try {
        const { status, includeArchived } = req.query;
        const result = await checkInService.getJobItemsLocationsService({
            status,
            includeArchived: includeArchived === "true",
        });
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy vị trí công việc thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getJobItemsLocationsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Xử lý geocoding reverse (gọi API bên ngoài)
 */
export const getGeocodingReverseController = async (req, res) => {
    try {
        const { lat, lng, language } = req.query;
        const result = await checkInService.getGeocodingReverseService({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            language: language || "vi",
        });
        res.json({
            status: "success",
            data: result.data,
            message: "Geocoding reverse thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getGeocodingReverseController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};
