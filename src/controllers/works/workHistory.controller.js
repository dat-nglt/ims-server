import logger from "../../utils/logger.js";
import * as workHistoryService from "../../services/works/index.js";

/**
 * Lấy danh sách tất cả lịch sử với filters và pagination
 */
export const getAllWorkHistoriesController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      action,
      field_changed,
      changed_by,
      date_from,
      date_to,
      work_id,
    } = req.query;

    const filters = {
      action,
      field_changed,
      changed_by: changed_by ? parseInt(changed_by) : null,
      date_from,
      date_to,
      work_id: work_id ? parseInt(work_id) : null,
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await workHistoryService.getFilteredWorkHistoriesService(filters, pagination);

    res.json({
      status: "success",
      data: result.data,
      pagination: result.pagination,
      message: "Lấy danh sách lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllWorkHistoriesController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy lịch sử theo work ID
 */
export const getWorkHistoryByWorkIdController = async (req, res) => {
  try {
    const { workId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await workHistoryService.getWorkHistoryByWorkIdService(workId, pagination);

    res.json({
      status: "success",
      data: result.data,
      pagination: result.pagination,
      message: "Lấy lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkHistoryByWorkIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo mới lịch sử công việc
 */
export const createWorkHistoryController = async (req, res) => {
  try {
    const historyData = req.body;
    const result = await workHistoryService.createWorkHistoryService(historyData);

    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkHistoryController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cập nhật ghi chú cho lịch sử
 */
export const updateWorkHistoryNotesController = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await workHistoryService.updateWorkHistoryNotesService(id, notes);

    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật ghi chú thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateWorkHistoryNotesController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Xóa lịch sử công việc
 */
export const deleteWorkHistoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await workHistoryService.deleteWorkHistoryService(id);

    res.json({
      status: "success",
      message: "Xóa lịch sử công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteWorkHistoryController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
