import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Lấy danh sách tất cả phân công (legacy)
 */
export const getAllWorkAssignmentsService = async () => {
  try {
    const assignments = await db.WorkAssignment.findAll({
      include: [
        { model: db.Work, as: "work", attributes: ['id', 'title', 'status', 'due_date'] },
        { model: db.User, as: "technician", attributes: ['id', 'name', 'email'] },
        { model: db.User, as: "assignedByUser", attributes: ['id', 'name'] },
      ],
      order: [["assignment_date", "DESC"]],
    });
    return { success: true, data: assignments };
  } catch (error) {
    logger.error("Error in getAllWorkAssignmentsService:", error.message);
    throw error;
  }
};
export const getWorkAssignmentsService = async (queryParams = {}) => {
  try {
    const { page = 1, limit = 20, technician_id, work_id, assigned_status, assigned_by } = queryParams;

    const where = {};
    if (technician_id) where.technician_id = technician_id;
    if (work_id) where.work_id = work_id;
    if (assigned_status) where.assigned_status = assigned_status;
    if (assigned_by) where.assigned_by = assigned_by;

    const offset = (page - 1) * limit;

    const { count, rows } = await db.WorkAssignment.findAndCountAll({
      where,
      include: [
        { model: db.Work, as: "work", attributes: ['id', 'title', 'status', 'due_date'] },
        { model: db.User, as: "technician", attributes: ['id', 'name', 'email'] },
        { model: db.User, as: "assignedByUser", attributes: ['id', 'name'] },
      ],
      order: [["assignment_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: {
        assignments: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      }
    };
  } catch (error) {
    logger.error("Error in getWorkAssignmentsService:", error.message);
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
 * Tạo phân công công việc (Phase 2: Technician assignment after work creation)
 * This is the detailed assignment with scheduling and status tracking
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
      throw new Error("Thiếu thông tin bắt buộc: work_id, technician_id, assigned_by");
    }

    // Check if work exists
    const work = await db.Work.findByPk(work_id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Check if technician exists
    const technician = await db.User.findByPk(technician_id);
    if (!technician) {
      throw new Error("Kỹ thuật viên không tồn tại");
    }

    // Check if assignment already exists for this work and technician
    const existingAssignment = await db.WorkAssignment.findOne({
      where: { work_id, technician_id, assigned_status: { [Op.ne]: 'rejected' } }
    });
    if (existingAssignment) {
      throw new Error("Phân công đã tồn tại cho công việc và kỹ thuật viên này");
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

/**
 * Cập nhật phân công công việc
 */
export const updateWorkAssignmentService = async (id, updateData) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id);
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }

    const { estimated_start_time, estimated_end_time, notes } = updateData;

    await assignment.update({
      estimated_start_time: estimated_start_time !== undefined ? estimated_start_time : assignment.estimated_start_time,
      estimated_end_time: estimated_end_time !== undefined ? estimated_end_time : assignment.estimated_end_time,
      notes: notes !== undefined ? notes : assignment.notes,
      updated_at: new Date(),
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in updateWorkAssignmentService:", error.message);
    throw error;
  }
};

/**
 * Bắt đầu công việc (set actual_start_time)
 */
export const startWorkAssignmentService = async (id) => {
  try {
    const assignment = await db.WorkAssignment.findByPk(id);
    if (!assignment) {
      throw new Error("Phân công không tồn tại");
    }

    if (assignment.assigned_status !== 'accepted') {
      throw new Error("Chỉ có thể bắt đầu công việc đã được chấp nhận");
    }

    await assignment.update({
      actual_start_time: new Date(),
      updated_at: new Date(),
    });

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in startWorkAssignmentService:", error.message);
    throw error;
  }
};

/**
 * Gán kỹ thuật viên cho công việc (Phase 2: Technician assignment)
 * This creates a WorkAssignment record for the technician and updates work status if needed
 */
export const assignTechnicianToWorkService = async (workId, technicianData) => {
  try {
    const { technician_id, assigned_by, estimated_start_time, estimated_end_time, notes } = technicianData;

    if (!technician_id || !assigned_by) {
      throw new Error("Thiếu thông tin bắt buộc: technician_id, assigned_by");
    }

    // Check if work exists
    const work = await db.Work.findByPk(workId);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Check if technician exists
    const technician = await db.User.findByPk(technician_id);
    if (!technician) {
      throw new Error("Kỹ thuật viên không tồn tại");
    }

    // Check if assignment already exists for this work and technician
    const existingAssignment = await db.WorkAssignment.findOne({
      where: { work_id: workId, technician_id, assigned_status: { [Op.ne]: 'rejected' } }
    });
    if (existingAssignment) {
      throw new Error("Phân công đã tồn tại cho công việc và kỹ thuật viên này");
    }

    // Create assignment
    const assignment = await db.WorkAssignment.create({
      work_id: workId,
      technician_id,
      assigned_by,
      estimated_start_time,
      estimated_end_time,
      notes,
      assigned_status: "pending",
    });

    // Optionally update work status to 'assigned' if not already
    if (work.status === 'pending') {
      await work.update({ status: 'assigned', updated_at: new Date() });
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in assignTechnicianToWorkService:", error.message);
    throw error;
  }
};
