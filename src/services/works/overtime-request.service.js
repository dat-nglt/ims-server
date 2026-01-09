import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Service: Tạo yêu cầu tăng ca mới
 * @param {Object} data - Dữ liệu yêu cầu tăng ca
 * @returns {Object} - Kết quả thực thi
 */
export const createOvertimeRequestService = async (data) => {
  try {
    const {
      user_id,
      work_id,
      work_title,
      requested_date,
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
      technician_ids = [],
    } = data;

    // Validate required fields
    if (!user_id || !requested_date || !start_time || !end_time || !overtime_type || technician_ids.length === 0) {
      return {
        success: false,
        data: null,
        message:
          "Vui lòng cung cấp đầy đủ thông tin (user_id, requested_date, start_time, end_time, overtime_type, technician_ids)",
      };
    }

    // Check if user exists
    const user = await db.User.findByPk(user_id);
    if (!user) {
      return {
        success: false,
        data: null,
        message: "Người dùng không tồn tại",
      };
    }

    // If work_id provided, check if work exists
    if (work_id) {
      const work = await db.Work.findByPk(work_id);
      if (!work) {
        return {
          success: false,
          data: null,
          message: "Công việc không tồn tại",
        };
      }
    }

    // Create overtime request
    const overtimeRequest = await db.OvertimeRequest.create({
      user_id: user.id,
      work_id,
      work_title,
      requested_date,
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
      technician_ids,
      status: "pending",
    });

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(overtimeRequest.id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email", "phone"] },
        { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
      ],
    });

    // Attach technician details
    const resultJson = result.toJSON();
    if (Array.isArray(resultJson.technician_ids) && resultJson.technician_ids.length > 0) {
      const technicians = await db.User.findAll({
        where: { id: { [Op.in]: resultJson.technician_ids } },
        attributes: ["id", "name", "email", "phone"],
        raw: true,
      });
      const techById = Object.fromEntries(technicians.map((t) => [t.id, t]));
      resultJson.technicians = resultJson.technician_ids.map((id) => techById[id]).filter(Boolean);
    } else {
      resultJson.technicians = [];
    }

    logger.info(
      `Overtime request created: ${resultJson.id} by user ${user_id} for technicians: ${resultJson.technician_ids?.join(", ")}`
    );

    return {
      success: true,
      data: resultJson,
      message: "Yêu cầu tăng ca đã được tạo thành công",
    };
  } catch (error) {
    logger.error("Error in createOvertimeRequestService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi tạo yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Lấy danh sách yêu cầu tăng ca của người dùng
 * @param {number} userId - ID người dùng
 * @param {Object} filters - Bộ lọc (status, startDate, endDate)
 * @returns {Object} - Kết quả thực thi
 */
export const getOvertimeRequestsByUserService = async (userId, filters = {}) => {
  try {
    const { status, startDate, endDate, limit = 50, offset = 0 } = filters;

    // Build where condition
    const whereCondition = { user_id: userId };

    if (status) {
      whereCondition.status = status;
    }

    if (startDate || endDate) {
      whereCondition.requested_date = {};
      if (startDate) {
        whereCondition.requested_date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requested_date[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await db.OvertimeRequest.findAndCountAll({
      where: whereCondition,
      include: [
        { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
        { model: db.User, as: "approver", attributes: ["id", "name"] },
      ],
      order: [["requested_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Convert to JSON format
    const processedRows = rows.map((row) => row.toJSON());

    // Populate technician details for each request
    const allTechnicianIds = processedRows.flatMap((r) => r.technician_ids || []);
    const uniqueTechnicianIds = [...new Set(allTechnicianIds)].filter(Boolean);
    let techById = {};
    if (uniqueTechnicianIds.length > 0) {
      const technicians = await db.User.findAll({
        where: { id: { [Op.in]: uniqueTechnicianIds } },
        attributes: ["id", "name", "email", "phone"],
        raw: true,
      });
      techById = Object.fromEntries(technicians.map((t) => [t.id, t]));
    }
    processedRows.forEach((r) => {
      r.technicians = (r.technician_ids || []).map((id) => techById[id]).filter(Boolean);
    });

    return {
      success: true,
      data: processedRows,
      total: count,
      message: "Lấy danh sách yêu cầu tăng ca thành công",
    };
  } catch (error) {
    logger.error("Error in getOvertimeRequestsByUserService: " + error.message);
    return {
      success: false,
      data: [],
      message: "Lỗi khi lấy danh sách yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Lấy danh sách yêu cầu tăng ca chờ duyệt
 * @param {Object} filters - Bộ lọc (startDate, endDate, limit, offset)
 * @returns {Object} - Kết quả thực thi
 */
export const getAllOvertimeRequestsService = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 100, offset = 0 } = filters;

    // Return all overtime requests; we'll order so that pending records come first
    const whereCondition = {};

    if (startDate || endDate) {
      whereCondition.requested_date = {};
      if (startDate) {
        whereCondition.requested_date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requested_date[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await db.OvertimeRequest.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
      ],
      // Put pending requests first (use Sequelize model alias), then sort by requested_date
      order: [
        [db.sequelize.literal('CASE WHEN "OvertimeRequest"."status" = \'pending\' THEN 0 ELSE 1 END'), "ASC"],
        ["requested_date", "ASC"],
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Convert to JSON format
    const processedRows = rows.map((row) => row.toJSON());

    // Populate technician details for each request
    const allTechnicianIds = processedRows.flatMap((r) => r.technician_ids || []);
    const uniqueTechnicianIds = [...new Set(allTechnicianIds)].filter(Boolean);
    let techById = {};
    if (uniqueTechnicianIds.length > 0) {
      const technicians = await db.User.findAll({
        where: { id: { [Op.in]: uniqueTechnicianIds } },
        attributes: ["id", "name", "email", "phone"],
        raw: true,
      });
      techById = Object.fromEntries(technicians.map((t) => [t.id, t]));
    }
    processedRows.forEach((r) => {
      r.technicians = (r.technician_ids || []).map((id) => techById[id]).filter(Boolean);
    });

    return {
      success: true,
      data: processedRows,
      total: count,
      message: "Lấy danh sách yêu cầu tăng ca thành công",
    };
  } catch (error) {
    logger.error("Error in getAllOvertimeRequestsService: " + error.message);
    return {
      success: false,
      data: [],
      message: "Lỗi khi lấy danh sách yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Duyệt yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} approverId - ID người duyệt
 * @param {Object} approvalData - Dữ liệu duyệt (isPaid, notes)
 * @returns {Object} - Kết quả thực thi
 */
export const approveOvertimeRequestService = async (requestId, approverId, approvalData = {}) => {
  try {
    const { is_paid = false, notes } = approvalData;

    // Check if request exists
    const overtimeRequest = await db.OvertimeRequest.findByPk(requestId);
    if (!overtimeRequest) {
      return {
        success: false,
        data: null,
        message: "Không có yêu cầu tăng ca nào cho công việc hiện tại",
      };
    }

    // Check if approver exists
    const approver = await db.User.findByPk(approverId);
    if (!approver) {
      return {
        success: false,
        data: null,
        message: "Bạn không thể phê duyệt yêu cầu tăng ca này",
      };
    }

    // Check if status is pending
    if (overtimeRequest.status !== "pending") {
      return {
        success: false,
        data: null,
        message: `Không thể duyệt yêu cầu có trạng thái: ${overtimeRequest.status}`,
      };
    }

    // Update overtime request
    const updatedRequest = await overtimeRequest.update({
      status: "approved",
      approver_id: approverId,
      approved_at: new Date(),
      is_paid,
      notes,
    });

    console.log("Updated Overtime Request:", updatedRequest.toJSON());

    console.log("Associated Work ID:", overtimeRequest.work_id);

    // Cập nhật trạng thái chấp nhận tăng ca cho các kỹ thuật viên liên quan trong WorkAssignment
    if (overtimeRequest.work_id) {
      const technicianIds = Array.isArray(overtimeRequest.technician_ids) ? overtimeRequest.technician_ids : [];

      if (technicianIds.length > 0) {
        // Update WorkAssignment records to allow overtime
        await db.WorkAssignment.update(
          { allow_overtime: true },
          {
            where: {
              work_id: overtimeRequest.work_id,
              technician_id: { [Op.in]: technicianIds },
            },
          }
        );

        logger.info(
          `Updated allow_overtime for work ${overtimeRequest.work_id} with technicians: ${technicianIds.join(", ")}`
        );
      }
    }

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(updatedRequest.id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
        { model: db.User, as: "approver", attributes: ["id", "name"] },
      ],
    });

    // Convert to JSON format and attach technicians
    const data = result.toJSON();
    if (Array.isArray(data.technician_ids) && data.technician_ids.length > 0) {
      const technicians = await db.User.findAll({
        where: { id: { [Op.in]: data.technician_ids } },
        attributes: ["id", "name", "email", "phone"],
        raw: true,
      });
      const techById = Object.fromEntries(technicians.map((t) => [t.id, t]));
      data.technicians = data.technician_ids.map((id) => techById[id]).filter(Boolean);
    } else {
      data.technicians = [];
    }

    logger.info(`Overtime request ${requestId} approved by user ${approverId}`);

    return {
      success: true,
      data,
      message: "Yêu cầu tăng ca đã được duyệt thành công",
    };
  } catch (error) {
    logger.error("Error in approveOvertimeRequestService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi duyệt yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Từ chối yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} approverId - ID người từ chối
 * @param {string} rejectReason - Lý do từ chối
 * @returns {Object} - Kết quả thực thi
 */
export const rejectOvertimeRequestService = async (requestId, approverId, rejectReason) => {
  try {
    // Check if request exists
    const overtimeRequest = await db.OvertimeRequest.findByPk(requestId);
    if (!overtimeRequest) {
      return {
        success: false,
        data: null,
        message: "Yêu cầu tăng ca không tồn tại",
      };
    }

    // Check if approver exists
    const approver = await db.User.findByPk(approverId);
    if (!approver) {
      return {
        success: false,
        data: null,
        message: "Người từ chối không tồn tại",
      };
    }

    // Check if status is pending
    if (overtimeRequest.status !== "pending") {
      return {
        success: false,
        data: null,
        message: `Không thể từ chối yêu cầu có trạng thái: ${overtimeRequest.status}`,
      };
    }

    // Update overtime request
    const updatedRequest = await overtimeRequest.update({
      status: "rejected",
      approver_id: approverId,
      approved_at: new Date(),
      notes: rejectReason,
    });

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(updatedRequest.id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
        { model: db.User, as: "approver", attributes: ["id", "name"] },
      ],
    });

    // Convert to JSON format and attach technicians
    const data = result.toJSON();
    if (Array.isArray(data.technician_ids) && data.technician_ids.length > 0) {
      const technicians = await db.User.findAll({
        where: { id: { [Op.in]: data.technician_ids } },
        attributes: ["id", "name", "email", "phone"],
        raw: true,
      });
      const techById = Object.fromEntries(technicians.map((t) => [t.id, t]));
      data.technicians = data.technician_ids.map((id) => techById[id]).filter(Boolean);
    } else {
      data.technicians = [];
    }

    logger.info(`Overtime request ${requestId} rejected by user ${approverId}`);

    return {
      success: true,
      data,
      message: "Yêu cầu tăng ca đã bị từ chối",
    };
  } catch (error) {
    logger.error("Error in rejectOvertimeRequestService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi từ chối yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Lấy thống kê tăng ca
 * @param {Object} filters - Bộ lọc (userId, department, startDate, endDate, status)
 * @returns {Object} - Kết quả thực thi
 */
export const getOvertimeStatisticsService = async (filters = {}) => {
  try {
    const { userId, department, startDate, endDate, status } = filters;

    const whereCondition = {};

    if (userId) {
      whereCondition.user_id = userId;
    }

    if (status) {
      whereCondition.status = status;
    }

    if (startDate || endDate) {
      whereCondition.requested_date = {};
      if (startDate) {
        whereCondition.requested_date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereCondition.requested_date[Op.lte] = new Date(endDate);
      }
    }

    // Get statistics
    const total = await db.OvertimeRequest.count({ where: whereCondition });
    const pending = await db.OvertimeRequest.count({
      where: { ...whereCondition, status: "pending" },
    });
    const approved = await db.OvertimeRequest.count({
      where: { ...whereCondition, status: "approved" },
    });
    const rejected = await db.OvertimeRequest.count({
      where: { ...whereCondition, status: "rejected" },
    });
    const cancelled = await db.OvertimeRequest.count({
      where: { ...whereCondition, status: "cancelled" },
    });

    // Calculate total hours (sum of duration_minutes and convert to hours)
    const result = await db.OvertimeRequest.findAll({
      attributes: [[db.sequelize.fn("SUM", db.sequelize.col("duration_minutes")), "totalMinutes"]],
      where: whereCondition,
      raw: true,
    });

    const totalHours = result[0]?.totalMinutes ? result[0].totalMinutes / 60 : 0;

    return {
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        cancelled,
        totalHours: Math.round(totalHours * 10) / 10,
      },
      message: "Lấy thống kê tăng ca thành công",
    };
  } catch (error) {
    logger.error("Error in getOvertimeStatisticsService: " + error.message);
    return {
      success: false,
      data: {},
      message: "Lỗi khi lấy thống kê tăng ca: " + error.message,
    };
  }
};
