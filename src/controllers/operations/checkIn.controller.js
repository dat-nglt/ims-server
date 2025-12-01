import logger from "../../utils/logger.js";
import * as checkInService from "../../services/operations/index.js";

export const getLocationController = async (req, res) => {
    try {
        const { access_token, code } = req.query;
        const result = await checkInService.getLocationService(
            access_token,
            code
        );
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin vị trí thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getLocationController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

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
        logger.error(`[${req.id}] Error in checkInController:`, error.message);
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
        logger.error(`[${req.id}] Error in checkOutController:`, error.message);
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
