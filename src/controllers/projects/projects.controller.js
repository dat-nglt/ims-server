import logger from "../../utils/logger.js";
import * as projectsService from "../../services/projects/projects.service.js";
import * as projectHistoryService from "../../services/projects/project-history.service.js";

export const getProjectsController = async (req, res) => {
  try {
    const result = await projectsService.getProjectsService(req.query);
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getProjectsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getProjectsCategoryForWorkController = async (req, res) => {
  try {
    // Return all projects without filters or pagination
    const result = await projectsService.getProjectsCategoryForWorkService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getProjectsCategoryForWorkController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thống kê dự án
 */
export const getStatisticsController = async (req, res) => {
  try {
    const result = await projectsService.getStatisticsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thống kê dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getStatisticsController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy phân phối trạng thái và công việc
 */
export const getDistributionController = async (req, res) => {
  try {
    const result = await projectsService.getDistributionService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy phân phối dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getDistributionController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo dự án mới
 */
export const createProjectController = async (req, res) => {
  try {
    const result = await projectsService.createProjectService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in createProjectController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật dự án
 */
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await projectsService.updateProjectService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in updateProjectController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa dự án
 */
export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await projectsService.deleteProjectService(id);
    res.json({
      status: "success",
      data: result,
      message: "Xóa dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteProjectController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Lấy lịch sử dự án
 */
export const getProjectHistoriesController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await projectHistoryService.getAllProjectHistoriesService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy lịch sử dự án thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in getProjectHistoriesController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};
