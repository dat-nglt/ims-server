/**
 * Office Attendance Controller
 * Xử lý chấm công cho khối văn phòng
 */

import { checkInOfficeService } from "../../services/operations/attendanceCustomService/check-in-office.service.js";
import { checkOutOfficeService } from "../../services/operations/attendanceCustomService/check-out-office.service.js";
import logger from "../../utils/logger.js";

/**
 * POST /attendance/office/check-in
 * Chấm công vào văn phòng
 */
export const checkInOfficeController = async (req, res) => {
    try {
        const {
            user_id,
            office_location_id,
            attendance_type_id,
            department_id,
            photo_url,
            latitude,
            longitude,
            address,
            location_name,
            device_info,
            ip_address,
            attendance_category = "regular",
            check_in_time_on_local,
            check_in_metadata,
            distance_from_work,
            is_within_radius,
            violation_distance,
        } = req.body;

        // Validation
        if (!user_id || !office_location_id) {
            return res.status(400).json({
                success: false,
                message: "Thông tin chấm công không đầy đủ",
            });
        }

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Thông tin chấm công không đầy đủ - thiếu tọa độ",
            });
        }

        const payload = {
            user_id,
            office_location_id,
            attendance_type_id,
            department_id,
            photo_url,
            latitude,
            longitude,
            address,
            location_name,
            device_info,
            ip_address,
            attendance_category,
            check_in_time_on_local,
            check_in_metadata,
            distance_from_work,
            is_within_radius,
            violation_distance,
        };

        const result = await checkInOfficeService(payload);
        return res.status(200).json(result);
    } catch (error) {
        logger.error("Error in checkInOffice: " + error.message);
        res.status(500).json({
            success: false,
            message: "Hệ thống máy chủ gặp sự cố, vui lòng thử lại sau",
            error: error.message,
        });
    }
};

/**
 * POST /attendance/office/check-out
 * Chấm công ra văn phòng
 */
export const checkOutOfficeController = async (req, res) => {
    try {
        const {
            user_id,
            office_location_id,
            attendance_type_id,
            office_location_id_check_out,
            photo_url_check_out,
            latitude_check_out,
            longitude_check_out,
            address_check_out,
            location_name_check_out,
            device_info,
            ip_address,
            attendance_category = "regular",
            check_out_time_on_local,
            check_out_metadata,
            distance_from_work,
            is_within_radius,
            violation_distance,
        } = req.body;

        // Validation
        if (!user_id || !office_location_id || !office_location_id_check_out) {
            return res.status(400).json({
                success: false,
                message: "Thông tin chấm công không đầy đủ",
            });
        }

        const payload = {
            user_id,
            office_location_id,
            attendance_type_id,
            office_location_id_check_out,
            photo_url_check_out,
            latitude_check_out,
            longitude_check_out,
            address_check_out,
            location_name_check_out,
            device_info,
            ip_address,
            attendance_category,
            check_out_time_on_local,
            check_out_metadata,
            distance_from_work,
            is_within_radius,
            violation_distance,
        };

        const result = await checkOutOfficeService(payload);
        return res.status(200).json(result);
    } catch (error) {
        logger.error("Error in checkOutOffice: " + error.message);
        res.status(500).json({
            success: false,
            message: "Hệ thống máy chủ gặp sự cố, vui lòng thử lại sau",
            error: error.message,
        });
    }
};
