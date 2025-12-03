import * as ProjectService from "../../services/projects/projects.service.js";
import { getAllProjectHistoriesService } from "../../services/projects/projectHistory.service.js";

// GET /api/projects
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
        const projects = await ProjectService.getProjectsService(filters);
        res.status(200).json({
            success: true,
            message: "Lấy danh sách dự án thành công",
            data: projects,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({
            success: false,
            message: "Lấy danh sách dự án không thành công",
            error: error.message,
        });
    }
};

// GET /api/projects/statistics
export const getStatisticsController = async (req, res) => {
    try {
        const statistics = await ProjectService.getStatisticsService();
        res.status(200).json({
            success: true,
            message: "Lấy thống kê dự án thành công",
            data: statistics,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message,
        });
    }
};

// GET /api/projects/distribution
export const getDistributionController = async (req, res) => {
    try {
        const distribution = await ProjectService.getDistributionService();
        res.status(200).json({
            success: true,
            message: "Distribution fetched successfully",
            data: distribution,
        });
    } catch (error) {
        console.error("Error fetching distribution:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch distribution",
            error: error.message,
        });
    }
};

// POST /api/projects
export const createProjectController = async (req, res) => {
    try {
        const {
            name,
            status,
            priority,
            start_date,
            end_date,
            manager_id,
            budget,
            description,
        } = req.body;
        // Basic validation
        if (
            !name ||
            !status ||
            !priority ||
            !start_date ||
            !end_date ||
            !manager_id ||
            budget == null
        ) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }
        const projectData = {
            name,
            status,
            priority,
            start_date: start_date,
            end_date: end_date,
            manager_id: manager_id,
            budget,
            description,
        };
        const newProject = await ProjectService.createProjectService(
            projectData
        );
        res.status(201).json({
            success: true,
            message: "Tạo dự án thành công",
            data: newProject,
        });
    } catch (error) {
        console.error("Lỗi tạo dự án:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi trong quá trình tạo dự án",
            error: error.message,
        });
    }
};

// PUT /api/projects/:id
export const updateProjectController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            status,
            priority,
            startDate,
            endDate,
            manager_id,
            budget,
            description,
        } = req.body;
        const projectData = {
            name,
            status,
            priority,
            start_date: startDate,
            end_date: endDate,
            manager_id: manager_id,
            budget,
            description,
        };
        const updatedProject = await ProjectService.updateProjectService(
            id,
            projectData
        );
        if (!updatedProject) {
            return res
                .status(404)
                .json({ success: false, message: "Dự án không tồn tại" });
        }
        res.status(200).json({
            success: true,
            message: "Cập nhật dự án thành công",
            data: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            success: false,
            message: "Cập nhật dự án không thành công",
            error: error.message,
        });
    }
};

// DELETE /api/projects/:id
export const deleteProjectController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProjectService.deleteProjectService(id);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Dự án không tồn tại" });
        }
        res.status(200).json({
            success: true,
            message: "Xoá dự án thành công",
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            success: false,
            message: "Xoá dự án không thành công",
            error: error.message,
        });
    }
};

// GET /api/projects/:id/history
export const getProjectHistoriesController = async (req, res) => {
    try {
        const { id } = req.params;
        const histories = await getAllProjectHistoriesService(id);
        res.status(200).json({
            success: true,
            message: "Lấy lịch sử dự án thành công",
            data: histories,
        });
    } catch (error) {
        console.error("Error fetching project histories:", error);
        res.status(500).json({
            success: false,
            message: "Lấy lịch sử dự án không thành công",
            error: error.message,
        });
    }
};
