import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả quy trình
 */
export const getAllApprovalWorkflowsService = async () => {
  try {
    const workflows = await db.ApprovalWorkflow.findAll({
      include: [
        { model: db.Work, as: "work" },
        { model: db.WorkReport, as: "report" },
        { model: db.User, as: "currentApprover" },
      ],
    });

    return { success: true, data: workflows };
  } catch (error) {
    logger.error("Error in getAllApprovalWorkflowsService:", error.message);
    throw error;
  }
};

/**
 * Lấy quy trình theo ID
 */
export const getApprovalWorkflowByIdService = async (id) => {
  try {
    const workflow = await db.ApprovalWorkflow.findByPk(id, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.WorkReport, as: "report" },
        { model: db.User, as: "currentApprover" },
      ],
    });

    if (!workflow) {
      throw new Error("Quy trình phê duyệt không tồn tại");
    }

    return { success: true, data: workflow };
  } catch (error) {
    logger.error("Error in getApprovalWorkflowByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo quy trình
 */
export const createApprovalWorkflowService = async (workflowData) => {
  try {
    const { work_id, report_id, current_approver_id } = workflowData;

    if (!work_id || !report_id) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const workflow = await db.ApprovalWorkflow.create({
      work_id,
      report_id,
      current_approver_id,
      approval_step: 1,
      current_step_status: "pending",
    });

    return { success: true, data: workflow };
  } catch (error) {
    logger.error("Error in createApprovalWorkflowService:", error.message);
    throw error;
  }
};

/**
 * Phê duyệt bước
 */
export const approveWorkflowStepService = async (id, approvalData) => {
  try {
    const workflow = await db.ApprovalWorkflow.findByPk(id);
    if (!workflow) {
      throw new Error("Quy trình phê duyệt không tồn tại");
    }

    const { comments } = approvalData;

    await workflow.update({
      current_step_status: "approved",
      comments,
      approval_step: workflow.approval_step + 1,
    });

    return { success: true, data: workflow };
  } catch (error) {
    logger.error("Error in approveWorkflowStepService:", error.message);
    throw error;
  }
};

/**
 * Từ chối bước
 */
export const rejectWorkflowStepService = async (id, rejectionData) => {
  try {
    const workflow = await db.ApprovalWorkflow.findByPk(id);
    if (!workflow) {
      throw new Error("Quy trình phê duyệt không tồn tại");
    }

    const { comments } = rejectionData;

    await workflow.update({
      current_step_status: "rejected",
      comments,
    });

    return { success: true, data: workflow };
  } catch (error) {
    logger.error("Error in rejectWorkflowStepService:", error.message);
    throw error;
  }
};
