import logger from "../../utils/logger.js";
import * as workService from "../../services/works/index.js";

/**
 * Lấy danh sách tất cả công việc
 */
export const getAllWorksController = async (req, res) => {
    try {
        const result = await workService.getAllWorksService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getAllWorksController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getTechnicianListToAssignController = async (req, res) => {
    try {
        const result = await workService.getTechnicianListToAssignService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách kỹ thuật viên để phân công thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getTechnicianListToAssignController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};
/**
 * Lấy danh sách công việc với filters
 */
export const getWorksController = async (req, res) => {
    try {
        const result = await workService.getWorksService(req.query);
        res.json({
            status: "success",
            ...result.data,
            message: "Lấy danh sách công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorksController:` + error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy thống kê công việc
 */
export const getWorksStatisticsController = async (req, res) => {
    try {
        const { dateRange } = req.query;
        const result = await workService.getWorksStatisticsService(dateRange);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thống kê công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorksStatisticsController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy phân bố công việc
 */
export const getWorksDistributionController = async (req, res) => {
    try {
        const { dateRange } = req.query;
        const result = await workService.getWorksDistributionService(dateRange);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy phân bố công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorksDistributionController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy công việc theo ID
 */
export const getWorkByCodeController = async (req, res) => {
    try {
        const { workCode: workCode } = req.params;
        const result = await workService.getWorkByCodeService(workCode);
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy thông tin công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorkByIdController:`, error.message);
        res.status(404).json({ error: error.message });
    }
};

/**
 * Tạo công việc mới
 */
export const createWorkController = async (req, res) => {
    try {
        const result = await workService.createWorkService(req.body);
        res.status(201).json({
            status: "success",
            data: result.data,
            message: "Tạo công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in createWorkController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Cập nhật công việc
 */
export const updateWorkController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await workService.updateWorkService(id, req.body);
        res.json({
            status: "success",
            data: result.data,
            message: "Cập nhật công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in updateWorkController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Phê duyệt công việc
 */
export const approveWorkController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await workService.approveWorkService(id, req.body);
        res.json({
            status: "success",
            data: result.data,
            message: "Phê duyệt công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in approveWorkController:`, error.message);
        res.status(400).json({ error: error.message });
    }
};

/**
 * Xóa công việc
 */
export const deleteWorkController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await workService.deleteWorkService(id);
        res.json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in deleteWorkController:`, error.message);
        res.status(404).json({ error: error.message });
    }
};

/**
 * Lấy danh sách danh mục công việc
 */
export const getWorkCategoriesController = async (req, res) => {
    try {
        const result = await workService.getWorkCategoriesService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách danh mục công việc thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorkCategoriesController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy danh sách loại dịch vụ
 */
export const getServiceTypesController = async (req, res) => {
    try {
        const result = await workService.getServiceTypesService();
        res.json({
            status: "success",
            data: result.data,
            message: "Lấy danh sách loại dịch vụ thành công",
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getServiceTypesController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Export công việc
 */
export const exportWorksController = async (req, res) => {
    try {
        const result = await workService.exportWorksService(req.query);
        const { format = "csv" } = req.query;

        if (format === "csv") {
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", 'attachment; filename="works.csv"');
        } else if (format === "xlsx") {
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", 'attachment; filename="works.xlsx"');
        }

        res.send(result.data);
    } catch (error) {
        logger.error(`[${req.id}] Error in exportWorksController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy công việc theo trạng thái
 */
export const getWorksByStatusController = async (req, res) => {
    try {
        const { status } = req.params;
        const result = await workService.getWorksByStatusService(status);
        res.json({
            status: "success",
            data: result.data,
            message: `Lấy danh sách công việc trạng thái ${status} thành công`,
        });
    } catch (error) {
        logger.error(`[${req.id}] Error in getWorksByStatusController:`, error.message);
        res.status(500).json({ error: error.message });
    }
};
