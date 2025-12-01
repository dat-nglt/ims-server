import logger from "../../utils/logger.js";
import * as workCategoryService from "../../services/works/index.js";

/**
 * Lấy danh sách tất cả danh mục
 */
export const getAllWorkCategoriesController = async (req, res) => {
  try {
    const result = await workCategoryService.getAllWorkCategoriesService(req.query);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách danh mục công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllWorkCategoriesController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy danh mục theo ID
 */
export const getWorkCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workCategoryService.getWorkCategoryByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin danh mục thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkCategoryByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo danh mục mới
 */
export const createWorkCategoryController = async (req, res) => {
  try {
    const result = await workCategoryService.createWorkCategoryService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo danh mục công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkCategoryController:`,
      error.message
    );
    if (error.message.includes("đã tồn tại")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

/**
 * Cập nhật danh mục
 */
export const updateWorkCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workCategoryService.updateWorkCategoryService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật danh mục công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateWorkCategoryController:`,
      error.message
    );
    if (error.message.includes("không tồn tại")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

/**
 * Xóa danh mục
 */
export const deleteWorkCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workCategoryService.deleteWorkCategoryService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteWorkCategoryController:`,
      error.message
    );
    if (error.message.includes("không tồn tại")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("liên quan")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
