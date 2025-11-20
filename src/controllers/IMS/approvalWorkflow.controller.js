import logger from "../../utils/logger.js";
import * as approvalWorkflowService from "../../services/IMS/approvalWorkflow.service.js";

/**
 * Lấy danh sách tất cả quy trình
 */
export const getAllApprovalWorkflowsController = async (req, res) => {
  try {
    const result = await approvalWorkflowService.getAllApprovalWorkflowsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách quy trình phê duyệt thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllApprovalWorkflowsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy quy trình theo ID
 */
export const getApprovalWorkflowByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approvalWorkflowService.getApprovalWorkflowByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin quy trình phê duyệt thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getApprovalWorkflowByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Tạo quy trình
 */
export const createApprovalWorkflowController = async (req, res) => {
  try {
    const result = await approvalWorkflowService.createApprovalWorkflowService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Tạo quy trình phê duyệt thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in createApprovalWorkflowController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Phê duyệt bước
 */
export const approveWorkflowStepController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approvalWorkflowService.approveWorkflowStepService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Phê duyệt bước quy trình thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in approveWorkflowStepController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Từ chối bước
 */
export const rejectWorkflowStepController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approvalWorkflowService.rejectWorkflowStepService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Từ chối bước quy trình thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in rejectWorkflowStepController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};
