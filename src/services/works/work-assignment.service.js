import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import { createWorkHistoryService } from "./work-history.service.js";

/**
 * Lấy danh sách tất cả phân công và group theo công việc
 */
export const getAllWorkAssignmentsService = async () => {
  try {
    const assignments = await db.WorkAssignment.findAll({
      include: [
        {
          model: db.Work,
          as: "work",
          attributes: ["id", "work_code", "title", "status", "due_date"],
        },
        {
          model: db.User,
          as: "technician",
        },
        {
          model: db.User,
          as: "assignedByUser",
          attributes: ["id", "name", "email", "position_id"],
        },
      ],
      order: [["assignment_date", "DESC"]],
    });

    // Group assignments by work
    const groupedAssignments = new Map();

    for (const assignment of assignments) {
      const workId = assignment.work_id;
      if (!groupedAssignments.has(workId)) {
        groupedAssignments.set(workId, {
          work: assignment.work,
          assignments: [],
        });
      }
      groupedAssignments.get(workId).assignments.push(assignment);
    }

    // Convert to array
    const result = Array.from(groupedAssignments.values());

    return { success: true, data: result };
  } catch (error) {
    logger.error("Error in getAllWorkAssignmentsService: " + error.message);
    throw error;
  }
};

/**
 * Lấy phân công theo ID
 */
export const getWorkAssignmentForTechnicianService = async (technician_id) => {
  try {
    if (!technician_id) {
      throw new Error("Thiếu technician_id");
    }

    // Lấy tất cả phân công của kỹ thuật viên, loại trừ phân công bị từ chối và đã hủy
    const assignments = await db.WorkAssignment.findAll({
      where: { technician_id, assigned_status: { [Op.notIn]: ["rejected", "cancelled"] } },
      include: [{ model: db.Work, as: "work" }],
      order: [["assignment_date", "DESC"]],
    });

    // Nếu không có phân công => trả về mảng rỗng
    if (!assignments || assignments.length === 0) {
      return { success: true, data: [] };
    }

    // Map unique work theo work.id và đính kèm thông tin phân công gần nhất
    const worksMap = new Map();

    for (const a of assignments) {
      const w = a.work;
      if (!w) continue;
      const plainWork = typeof w.get === "function" ? w.get({ plain: true }) : w;

      const assignmentMeta = {
        assignment_id: a.id,
        assigned_status: a.assigned_status,
        assignment_date: a.assignment_date,
        estimated_start_time: a.estimated_start_time,
        estimated_end_time: a.estimated_end_time,
      };

      const existing = worksMap.get(plainWork.id);
      if (!existing) {
        worksMap.set(plainWork.id, { ...plainWork, latest_assignment: assignmentMeta });
      } else {
        // nếu phân công mới hơn thì cập nhật latest_assignment
        const existingDate = existing.latest_assignment && existing.latest_assignment.assignment_date;
        if (!existingDate || (a.assignment_date && new Date(a.assignment_date) > new Date(existingDate))) {
          worksMap.set(plainWork.id, { ...plainWork, latest_assignment: assignmentMeta });
        }
      }
    }

    const works = Array.from(worksMap.values());
    return { success: true, data: works };
  } catch (error) {
    logger.error("Error in getWorkAssignmentByIdService:" + error.message);
    throw error;
  }
};

// Legacy duplicate removed - use `getWorkAssignmentByIdService(technician_id)` to get array of works for a technician.

/**
 * Tạo phân công công việc (Phase 2: Technician assignment after work creation)
 * This is the detailed assignment with scheduling and status tracking
 */
export const createWorkAssignmentService = async (assignmentData) => {
  try {
    const { work_id, technician_id, assigned_by, estimated_start_time, estimated_end_time, notes } = assignmentData;

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

    // Check if assigned_by exists
    const assigner = await db.User.findByPk(assigned_by);
    if (!assigner) {
      throw new Error("Người phân công không tồn tại");
    }

    // Check if assignment already exists for this work and technician
    const existingAssignment = await db.WorkAssignment.findOne({
      where: { work_id, technician_id, assigned_status: { [Op.ne]: "rejected" } },
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

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: work_id,
        action: "assigned",
        changed_by: assigned_by,
        notes: "Phân công kỹ thuật viên",
      });
    } catch (historyError) {
      logger.error(`Failed to log work history for assignment creation: ${historyError.message}`);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in createWorkAssignmentService:" + error.message);
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

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: assignment.work_id,
        action: "accepted",
        changed_by: assignment.technician_id,
        notes: "Phân công được chấp nhận",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for acceptance:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in acceptWorkAssignmentService:" + error.message);
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

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: assignment.work_id,
        action: "rejected",
        changed_by: assignment.technician_id,
        notes: "Phân công bị từ chối",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for rejection:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in rejectWorkAssignmentService:" + error.message);
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

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: assignment.work_id,
        action: "completed",
        changed_by: assignment.technician_id,
        notes: "Phân công hoàn thành",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for completion:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in completeWorkAssignmentService:" + error.message);
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

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: assignment.work_id,
        action: "updated",
        changed_by: updateData.changed_by || assignment.assigned_by,
        notes: "Phân công được cập nhật",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for update:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in updateWorkAssignmentService:" + error.message);
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

    if (assignment.assigned_status !== "accepted") {
      throw new Error("Chỉ có thể bắt đầu công việc đã được chấp nhận");
    }

    await assignment.update({
      actual_start_time: new Date(),
      updated_at: new Date(),
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: assignment.work_id,
        action: "started",
        changed_by: assignment.technician_id,
        notes: "Công việc bắt đầu",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for start:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in startWorkAssignmentService:" + error.message);
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

    // Check if assigned_by exists
    const assigner = await db.User.findByPk(assigned_by);
    if (!assigner) {
      throw new Error("Người phân công không tồn tại");
    }

    // Check if assignment already exists for this work and technician
    const existingAssignment = await db.WorkAssignment.findOne({
      where: { work_id: workId, technician_id, assigned_status: { [Op.ne]: "rejected" } },
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
    if (work.status === "pending") {
      await work.update({ status: "assigned", updated_at: new Date() });
    }

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: workId,
        action: "assigned",
        changed_by: assigned_by,
        notes: "Gán kỹ thuật viên cho công việc",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for technician assignment:", historyError.message);
    }

    return { success: true, data: assignment };
  } catch (error) {
    logger.error("Error in assignTechnicianToWorkService:" + error.message);
    throw error;
  }
};

/**
 * Lấy tất cả phân công của một công việc
 */
export const getWorkAssignmentsByWorkIdService = async (workId) => {
  try {
    // Check if work exists
    const work = await db.Work.findByPk(workId);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    const assignments = await db.WorkAssignment.findAll({
      where: { work_id: workId },
      include: [
        { model: db.Work, as: "work", attributes: ["id", "title", "status", "due_date"] },
        { model: db.User, as: "technician", attributes: ["id", "name", "email"] },
        { model: db.User, as: "assignedByUser", attributes: ["id", "name"] },
      ],
      order: [["assignment_date", "DESC"]],
    });

    return {
      success: true,
      data: assignments,
    };
  } catch (error) {
    logger.error("Error in getWorkAssignmentsByWorkIdService:" + error.message);
    throw error;
  }
};
