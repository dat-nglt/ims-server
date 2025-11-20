import logger from "../utils/logger.js";
import * as workAssignmentService from "../services/workAssignment.service.js";

/**
 * Lấy danh sách tất cả phân công
 */
export const getAllWorkAssignmentsController = async (req, res) => {
  try {
    const result = await workAssignmentService.getAllWorkAssignmentsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách phân công công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllWorkAssignmentsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy phân công theo ID
 */
export const getWorkAssignmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workAssignmentService.getWorkAssignmentByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin phân công thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getWorkAssignmentByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo phân công mới
 */
export const createWorkAssignmentController = async (req, res) => {
  try {
    const result = await workAssignmentService.createWorkAssignmentService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo phân công công việc thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createWorkAssignmentController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Chấp nhận phân công
 */
export const acceptWorkAssignmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workAssignmentService.acceptWorkAssignmentService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Chấp nhận phân công thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in acceptWorkAssignmentController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Từ chối phân công
 */
export const rejectWorkAssignmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workAssignmentService.rejectWorkAssignmentService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Từ chối phân công thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in rejectWorkAssignmentController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Hoàn thành phân công
 */
export const completeWorkAssignmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workAssignmentService.completeWorkAssignmentService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Hoàn thành phân công thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in completeWorkAssignmentController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
