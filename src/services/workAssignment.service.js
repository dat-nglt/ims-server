import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả phân công
 */
export const getAllWorkAssignmentsService = async () => {
  try {
    const assignments = await db.WorkAssignment.findAll({
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "technician" },
        { model: db.User, as: "assignedByUser" },
      ],
    });
    return { success: true, data: assignments };
  } catch (error) {
    logger.error("Error in getAllWorkAssignmentsService:", error.message);
    throw error;
  }
};

/**
 * Lấy phân công theo ID
 */
export const getWorkAssignmentByIdService = async (id) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "technician" },
        { model: db.User, as: "assignedByUser" },
      ],
    });
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }
    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in getWorkAssignmentByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo phân công công việc
 */
export const createWorkAssignmentService = async (assignmentData) => {
  try {
    const {
      work_id,
      technician_id,
      assigned_by,
      estimated_start_time,
      estimated_end_time,
      notes,
    } = assignmentData;

    if (!work_id || !technician_id || !assigned_by) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const assignment = await db.WorkAssignment.create({
      work_id,
      technician_id,
      assigned_by,
      estimated_start_time,
      estimated_end_time,
      notes,
      assigned_status: "pending",
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in createWorkAssignmentService:", error.message);
    throw error;
  }
};

/**
 * Chấp nhận phân công
 */
export const acceptWorkAssignmentService = async (id) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id);
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }

    await assignment.update({
      assigned_status: "accepted",
      accepted_at: new Date(),
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in acceptWorkAssignmentService:", error.message);
    throw error;
  }
};

/**
 * Từ chối phân công
 */
export const rejectWorkAssignmentService = async (id, rejectionData) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id);
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }

    const { rejected_reason } = rejectionData;

    await assignment.update({
      assigned_status: "rejected",
      rejected_reason,
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in rejectWorkAssignmentService:", error.message);
    throw error;
  }
};

/**
 * Hoàn thành phân công
 */
export const completeWorkAssignmentService = async (id) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id);
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }

    await assignment.update({
      assigned_status: "completed",
      actual_end_time: new Date(),
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in completeWorkAssignmentService:", error.message);
    throw error;
  }
};
