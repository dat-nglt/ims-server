import db from "../models/index.js";
import logger from "../utils/logger.js";

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
    logger.error("Error in getAllWorkReportsService:", error.message);
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
    logger.error("Error in getWorkReportByIdService:", error.message);
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

    const report = await db.WorkReport.create({
      work_id,
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

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in createWorkReportService:", error.message);
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

    await report.update({
      ...updateData,
      updated_at: new Date(),
    });

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in updateWorkReportService:", error.message);
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

    await report.update({
      approval_status: "approved",
      approved_by,
      approved_at: new Date(),
      quality_rating,
      status: "completed",
    });

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in approveWorkReportService:", error.message);
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

    await report.update({
      approval_status: "rejected",
      rejection_reason,
      approved_by,
      approved_at: new Date(),
    });

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in rejectWorkReportService:", error.message);
    throw error;
  }
};
