import logger from "../../utils/logger.js";
import * as technicianSkillService from "../../services/hr/index.js";

/**
 * Lấy danh sách tất cả kỹ năng kỹ thuật viên
 */
export const getAllTechnicianSkillsController = async (req, res) => {
    try {
        const result =
            await technicianSkillService.getAllTechnicianSkillsService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách kỹ năng kỹ thuật viên thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getAllTechnicianSkillsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy kỹ năng theo technician ID
 */
export const getTechnicianSkillByTechnicianIdController = async (req, res) => {
    try {
        const { technicianId } = req.params;
        const result =
            await technicianSkillService.getTechnicianSkillByTechnicianIdService(
                technicianId
            );
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy kỹ năng kỹ thuật viên thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getTechnicianSkillByTechnicianIdController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};

/**
 * Tạo kỹ năng
 */
export const createTechnicianSkillController = async (req, res) => {
    try {
        const result =
            await technicianSkillService.createTechnicianSkillService(req.body);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo kỹ năng kỹ thuật viên thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in createTechnicianSkillController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Cập nhật kỹ năng
 */
export const updateTechnicianSkillController = async (req, res) => {
    try {
        const { id: technicianId } = req.params;

        const result =
            await technicianSkillService.updateTechnicianSkillService(
                technicianId,
                req.body
            );
        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật kỹ năng kỹ thuật viên thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in updateTechnicianSkillController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Xóa kỹ năng
 */
export const deleteTechnicianSkillController = async (req, res) => {
    try {
        const { id } = req.params;
        const result =
            await technicianSkillService.deleteTechnicianSkillService(id);
        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in deleteTechnicianSkillController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};
