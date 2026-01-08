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
      requested_date,
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
    } = data;

    // Validate required fields
    if (!user_id || !requested_date || !start_time || !end_time || !overtime_type) {
      return {
        success: false,
        data: null,
        message: "Vui lòng cung cấp đầy đủ thông tin (user_id, requested_date, start_time, end_time, overtime_type)",
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
      user_id,
      work_id,
      requested_date,
      start_time,
      end_time,
      duration_minutes,
      reason,
      overtime_type,
      status: "pending",
    });

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(overtimeRequest.id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email", "phone"] },
        { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
      ],
    });

    logger.info(`Overtime request created: ${result.id} by user ${user_id}`);

    return {
      success: true,
      data: result,
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

    return {
      success: true,
      data: rows,
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
 * @param {Object} filters - Bộ lọc (department, startDate, endDate)
 * @returns {Object} - Kết quả thực thi
 */
export const getPendingOvertimeRequestsService = async (filters = {}) => {
  try {
    const { department, startDate, endDate, limit = 100, offset = 0 } = filters;

    const whereCondition = { status: "pending" };

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
          include: [
            {
              model: db.EmployeeProfile,
              as: "profile",
              attributes: ["id", "department_id"],
              // Filter by department if provided
              ...(department && { where: { department_id: department } }),
            },
          ],
        },
        { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
      ],
      order: [["requested_date", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      success: true,
      data: rows,
      total: count,
      message: "Lấy danh sách yêu cầu tăng ca chờ duyệt thành công",
    };
  } catch (error) {
    logger.error("Error in getPendingOvertimeRequestsService: " + error.message);
    return {
      success: false,
      data: [],
      message: "Lỗi khi lấy danh sách yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Lấy chi tiết yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @returns {Object} - Kết quả thực thi
 */
export const getOvertimeRequestDetailService = async (requestId) => {
  try {
    const overtimeRequest = await db.OvertimeRequest.findByPk(requestId, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email", "phone"] },
        { model: db.Work, as: "work", attributes: ["id", "title", "location", "status"] },
        { model: db.User, as: "approver", attributes: ["id", "name"] },
      ],
    });

    if (!overtimeRequest) {
      return {
        success: false,
        data: null,
        message: "Yêu cầu tăng ca không tồn tại",
      };
    }

    return {
      success: true,
      data: overtimeRequest,
      message: "Lấy chi tiết yêu cầu tăng ca thành công",
    };
  } catch (error) {
    logger.error("Error in getOvertimeRequestDetailService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi lấy chi tiết yêu cầu tăng ca: " + error.message,
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
        message: "Yêu cầu tăng ca không tồn tại",
      };
    }

    // Check if approver exists
    const approver = await db.User.findByPk(approverId);
    if (!approver) {
      return {
        success: false,
        data: null,
        message: "Người duyệt không tồn tại",
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

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(updatedRequest.id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
        { model: db.User, as: "approver", attributes: ["id", "name"] },
      ],
    });

    logger.info(`Overtime request ${requestId} approved by user ${approverId}`);

    return {
      success: true,
      data: result,
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

    logger.info(`Overtime request ${requestId} rejected by user ${approverId}`);

    return {
      success: true,
      data: result,
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
 * Service: Hủy yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} userId - ID người hủy (thường là người tạo)
 * @returns {Object} - Kết quả thực thi
 */
export const cancelOvertimeRequestService = async (requestId, userId) => {
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

    // Check if user is owner (optional - có thể cho phép manager hủy)
    if (overtimeRequest.user_id !== userId) {
      return {
        success: false,
        data: null,
        message: "Bạn không có quyền hủy yêu cầu này",
      };
    }

    // Check if status is pending
    if (overtimeRequest.status !== "pending") {
      return {
        success: false,
        data: null,
        message: `Không thể hủy yêu cầu có trạng thái: ${overtimeRequest.status}`,
      };
    }

    // Update overtime request
    const updatedRequest = await overtimeRequest.update({
      status: "cancelled",
    });

    logger.info(`Overtime request ${requestId} cancelled by user ${userId}`);

    return {
      success: true,
      data: updatedRequest,
      message: "Yêu cầu tăng ca đã được hủy",
    };
  } catch (error) {
    logger.error("Error in cancelOvertimeRequestService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi hủy yêu cầu tăng ca: " + error.message,
    };
  }
};

/**
 * Service: Cập nhật yêu cầu tăng ca (cho pending request)
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} userId - ID người cập nhật (phải là owner)
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} - Kết quả thực thi
 */
export const updateOvertimeRequestService = async (requestId, userId, updateData) => {
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

    // Check if user is owner
    if (overtimeRequest.user_id !== userId) {
      return {
        success: false,
        data: null,
        message: "Bạn không có quyền cập nhật yêu cầu này",
      };
    }

    // Check if status is pending
    if (overtimeRequest.status !== "pending") {
      return {
        success: false,
        data: null,
        message: `Không thể cập nhật yêu cầu có trạng thái: ${overtimeRequest.status}`,
      };
    }

    // Update only allowed fields
    const allowedFields = ["start_time", "end_time", "duration_minutes", "reason", "overtime_type"];
    const dataToUpdate = {};

    for (const field of allowedFields) {
      if (updateData.hasOwnProperty(field)) {
        dataToUpdate[field] = updateData[field];
      }
    }

    const updatedRequest = await overtimeRequest.update(dataToUpdate);

    // Fetch with relations
    const result = await db.OvertimeRequest.findByPk(updatedRequest.id, {
      include: [
        { model: db.Work, as: "work", attributes: ["id", "title"] },
      ],
    });

    logger.info(`Overtime request ${requestId} updated by user ${userId}`);

    return {
      success: true,
      data: result,
      message: "Yêu cầu tăng ca đã được cập nhật thành công",
    };
  } catch (error) {
    logger.error("Error in updateOvertimeRequestService: " + error.message);
    return {
      success: false,
      data: null,
      message: "Lỗi khi cập nhật yêu cầu tăng ca: " + error.message,
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
      attributes: [
        [db.sequelize.fn("SUM", db.sequelize.col("duration_minutes")), "totalMinutes"],
      ],
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
