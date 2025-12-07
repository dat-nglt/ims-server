import logger from "../../utils/logger.js";
import {
    getProjectsService,
    getStatisticsService,
    getDistributionService,
    createProjectService,
    updateProjectService,
    deleteProjectService,
} from "../../services/projects/projects.service.js";
import { getAllProjectHistoriesService } from "../../services/projects/project-history.service.js";

/**
 * Lấy danh sách dự án với bộ lọc, sắp xếp, phân trang
 */
export const getProjectsController = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            sort,
            page = 1,
            limit = 10,
        } = req.query;

        const filters = {
            search,
            status,
            priority,
            sort,
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const result = await getProjectsService(filters);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getProjectsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy thống kê dự án
 */
export const getStatisticsController = async (req, res) => {
    try {
        const result = await getStatisticsService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thống kê dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getStatisticsController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy phân phối trạng thái và công việc
 */
export const getDistributionController = async (req, res) => {
    try {
        const result = await getDistributionService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy phân phối dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getDistributionController:`,
            error.message
        );
        res.status(500).json({ error: error.message });
    }
};

/**
 * Tạo dự án mới
 */
export const createProjectController = async (req, res) => {
    try {
        const result = await createProjectService(req.body);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in createProjectController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Cập nhật dự án
 */
export const updateProjectController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateProjectService(id, req.body);
        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in updateProjectController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Xóa dự án
 */
export const deleteProjectController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteProjectService(id);
        res.json({
            status: "success",
            data: result,
            message: "Xóa dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in deleteProjectController:`,
            error.message
        );
        res.status(400).json({ error: error.message });
    }
};

/**
 * Lấy lịch sử dự án
 */
export const getProjectHistoriesController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getAllProjectHistoriesService(id);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy lịch sử dự án thành công",
        });
    } catch (error) {
        logger.error(
            `[${req.id}] Error in getProjectHistoriesController:`,
            error.message
        );
        res.status(404).json({ error: error.message });
    }
};