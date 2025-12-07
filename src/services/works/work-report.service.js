import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { createWorkHistoryService } from "./work-history.service.js";

/**
 * Lấy danh sách tất cả báo cáo công việc
 */
export const getAllWorkReportsService = async () => {
  try {
    const reports = await db.WorkReport.findAll({
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "reporter" },
        { model: db.User, as: "approver" },
      ],
    });
    return { success: true, data: reports };
  } catch (error) {
    logger.error("Error in getAllWorkReportsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy báo cáo công việc theo ID
 */
export const getWorkReportByIdService = async (id) => {
  try {
    const report = await db.WorkReport.findByPk(id, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.User, as: "reporter" },
        { model: db.User, as: "approver" },
      ],
    });
    if (!report) {
      throw new Error("Báo cáo không tồn tại");
    }
    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in getWorkReportByIdService:" + error.message);
    throw error;
  }
};

/**
 * Tạo báo cáo công việc
 */
export const createWorkReportService = async (reportData) => {
  try {
    const {
      work_id,
      reported_by,
      progress_percentage,
      description,
      notes,
      photo_urls,
      materials_used,
      issues_encountered,
      solution_applied,
      time_spent_hours,
      next_steps,
    } = reportData;

    if (!work_id || !reported_by) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    // Kiểm tra công việc tồn tại
    const work = await db.Work.findByPk(work_id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Kiểm tra người báo cáo tồn tại
    const reporter = await db.User.findByPk(reported_by);
    if (!reporter) {
      throw new Error("Người báo cáo không tồn tại");
    }

    const report = await db.WorkReport.create({
      work_id,
      project_id: work.project_id,
      reported_by,
      progress_percentage,
      status: "in_progress",
      description,
      notes,
      photo_urls,
      materials_used,
      issues_encountered,
      solution_applied,
      time_spent_hours,
      next_steps,
      approval_status: "pending",
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: work_id,
        action: "reported",
        changed_by: reported_by,
        notes: "Báo cáo công việc được tạo",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for report creation:" + historyError.message);
    }

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in createWorkReportService:" + error.message);
    throw error;
  }
};

/**
 * Cập nhật báo cáo công việc
 */
export const updateWorkReportService = async (id, updateData) => {
  try {
    const report = await db.WorkReport.findByPk(id);
    if (!report) {
      throw new Error("Báo cáo không tồn tại");
    }

    // Kiểm tra work_id nếu được cung cấp
    if (updateData.work_id) {
      const work = await db.Work.findByPk(updateData.work_id);
      if (!work) {
        throw new Error("Công việc không tồn tại");
      }
    }

    // Kiểm tra reported_by nếu được cung cấp
    if (updateData.reported_by) {
      const reporter = await db.User.findByPk(updateData.reported_by);
      if (!reporter) {
        throw new Error("Người báo cáo không tồn tại");
      }
    }

    await report.update({
      ...updateData,
      updated_at: new Date(),
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: report.work_id,
        action: "report_updated",
        changed_by: updateData.changed_by || report.reported_by,
        notes: "Báo cáo công việc được cập nhật",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for report update:" + historyError.message);
    }

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in updateWorkReportService:" + error.message);
    throw error;
  }
};

/**
 * Phê duyệt báo cáo công việc
 */
export const approveWorkReportService = async (id, approvalData) => {
  try {
    const report = await db.WorkReport.findByPk(id);
    if (!report) {
      throw new Error("Báo cáo không tồn tại");
    }

    const { approved_by, quality_rating } = approvalData;

    // Kiểm tra approved_by tồn tại
    if (approved_by) {
      const approver = await db.User.findByPk(approved_by);
      if (!approver) {
        throw new Error("Người phê duyệt không tồn tại");
      }
    }

    await report.update({
      approval_status: "approved",
      approved_by,
      approved_at: new Date(),
      quality_rating,
      status: "completed",
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: report.work_id,
        action: "report_approved",
        changed_by: approved_by,
        notes: "Báo cáo công việc được phê duyệt",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for report approval:" + historyError.message);
    }

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in approveWorkReportService:" + error.message);
    throw error;
  }
};

/**
 * Từ chối báo cáo công việc
 */
export const rejectWorkReportService = async (id, rejectionData) => {
  try {
    const report = await db.WorkReport.findByPk(id);
    if (!report) {
      throw new Error("Báo cáo không tồn tại");
    }

    const { rejection_reason, approved_by } = rejectionData;

    // Kiểm tra approved_by tồn tại
    if (approved_by) {
      const approver = await db.User.findByPk(approved_by);
      if (!approver) {
        throw new Error("Người phê duyệt không tồn tại");
      }
    }

    await report.update({
      approval_status: "rejected",
      rejection_reason,
      approved_by,
      approved_at: new Date(),
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: report.work_id,
        action: "report_rejected",
        changed_by: approved_by,
        notes: "Báo cáo công việc bị từ chối",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for report rejection:" + historyError.message);
    }

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in rejectWorkReportService:" + error.message);
    throw error;
  }
};
