import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import { createWorkHistoryService } from "./work-history.service.js";
import { createNotificationService } from "../operations/notification.service.js";

/**
 * Lấy danh sách tất cả công việc
 */
export const getAllWorksService = async () => {
  try {
    const works = await db.Work.findAll({
      include: [
        { model: db.WorkCategory, as: "category" },
        { model: db.User, as: "assignedUser" },
        { model: db.User, as: "salesPerson" },
      ],
    });
    return { success: true, data: works };
  } catch (error) {
    logger.error("Error in getAllWorksService: " + error.message);
    throw error;
  }
};

export const getTechnicianListToAssignService = async () => {
  try {
    const technicians = await db.User.findAll({
      // where: { role: "technician" },
      attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
    });
    return { success: true, data: technicians };
  } catch (error) {
    logger.error("Error in getTechnicianListToAssignService: " + error.message);
    throw error;
  }
};

/**
 * Lấy công việc theo mã công việc (work_code) - bao gồm báo cáo và phân công liên quan
 * Lấy đầy đủ các dữ liệu cần thiết cho WorkDetail page, bao gồm:
 * - Thông tin cơ bản công việc
 * - Các báo cáo tiến độ (work reports)
 * - Thông tin phân công cho kỹ thuật viên (work assignments)
 * - Chi tiết các user liên quan
 */
export const getWorkByCodeService = async (workCode) => {
  try {
    const work = await db.Work.findOne({
      where: { work_code: workCode },
      include: [
        // Danh mục công việc
        {
          model: db.WorkCategory,
          as: "category",
          attributes: ["id", "name"],
        },

        // Người được giao công việc
        {
          model: db.User,
          as: "assignedUser",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
        },

        // Kỹ thuật viên (nếu được giao trực tiếp)
        {
          model: db.User,
          as: "technician",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
        },

        // Nhân viên kinh doanh
        {
          model: db.User,
          as: "salesPerson",
          attributes: ["id", "name", "email", "phone", "avatar_url"],
        },

        // Dự án liên quan
        {
          model: db.Project,
          as: "project",
        },

        // Báo cáo tiến độ công việc
        {
          model: db.WorkReport,
          as: "reports",
          include: [
            {
              model: db.User,
              as: "reporter",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
            },
            {
              model: db.User,
              as: "approver",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
            },
            {
              model: db.User,
              as: "assignedApprover",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
            },
          ],
          order: [["reported_at", "DESC"]],
        },

        // Thông tin phân công công việc cho kỹ thuật viên
        {
          model: db.WorkAssignment,
          as: "assignments",
          attributes: [
            "id",
            "work_id",
            "technician_id",
            "assigned_by",
            "assignment_date",
            "assigned_status",
            "accepted_at",
            "rejected_reason",
            "estimated_start_time",
            "estimated_end_time",
            "actual_start_time",
            "actual_end_time",
            "notes",
            "created_at",
            "updated_at",
          ],
          include: [
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
        },
      ],
    });

    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in getWorkByCodeService: " + error.message);
    throw error;
  }
};

/**
 * Lấy công việc theo ID - bao gồm báo cáo và phân công liên quan
 * Lấy đầy đủ các dữ liệu cần thiết cho WorkDetail page
 */
export const getWorkByIdService = async (workId) => {
  try {
    const work = await db.Work.findByPk(workId, {
      include: [
        // Danh mục công việc
        {
          model: db.WorkCategory,
          as: "category",
          attributes: ["id", "name"],
        },

        // Người được giao công việc
        {
          model: db.User,
          as: "assignedUser",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
        },

        // Kỹ thuật viên (nếu được giao trực tiếp)
        {
          model: db.User,
          as: "technician",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
        },

        // Nhân viên kinh doanh
        {
          model: db.User,
          as: "salesPerson",
          attributes: ["id", "name", "email", "phone", "avatar_url"],
        },

        // Dự án liên quan
        {
          model: db.Project,
          as: "project",
          attributes: ["id", "project_code", "project_name", "description", "status"],
        },

        // Báo cáo tiến độ công việc
        {
          model: db.WorkReport,
          as: "reports",
          attributes: [
            "id",
            "work_id",
            "progress_percentage",
            "status",
            "description",
            "notes",
            "title",
            "location",
            "before_images",
            "during_images",
            "after_images",
            "materials_used",
            "issues_encountered",
            "solution_applied",
            "time_spent_hours",
            "next_steps",
            "approval_status",
            "quality_rating",
            "rejection_reason",
            "reported_at",
            "approved_at",
            "created_at",
            "reported_by",
            "approved_by",
            "assigned_approver",
          ],
          include: [
            {
              model: db.User,
              as: "reporter",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
            },
            {
              model: db.User,
              as: "approver",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
            },
            {
              model: db.User,
              as: "assignedApprover",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
            },
          ],
          order: [["reported_at", "DESC"]],
        },

        // Thông tin phân công công việc cho kỹ thuật viên
        {
          model: db.WorkAssignment,
          as: "assignments",
          attributes: [
            "id",
            "work_id",
            "technician_id",
            "assigned_by",
            "assignment_date",
            "assigned_status",
            "accepted_at",
            "rejected_reason",
            "estimated_start_time",
            "estimated_end_time",
            "actual_start_time",
            "actual_end_time",
            "notes",
            "created_at",
            "updated_at",
          ],
          include: [
            {
              model: db.User,
              as: "technician",
              attributes: ["id", "name", "email", "phone", "avatar_url", "position", "dailySalary", "hourly_rate"],
            },
            {
              model: db.User,
              as: "assignedByUser",
              attributes: ["id", "name", "email", "position"],
            },
          ],
          order: [["assignment_date", "DESC"]],
        },
      ],
    });

    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in getWorkByIdService: " + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách phân công công việc (work assignments) cho một công việc
 * Bao gồm thông tin kỹ thuật viên được phân công
 */
export const getWorkAssignmentsService = async (workId) => {
  try {
    const assignments = await db.WorkAssignment.findAll({
      where: { work_id: workId },
      include: [
        {
          model: db.User,
          as: "technician",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position", "dailySalary", "hourly_rate"],
        },
        {
          model: db.User,
          as: "assignedByUser",
          attributes: ["id", "name", "email", "position"],
        },
        {
          model: db.Work,
          as: "work",
          attributes: ["id", "work_code", "title", "status"],
        },
      ],
      order: [["assignment_date", "DESC"]],
    });

    return { success: true, data: assignments };
  } catch (error) {
    logger.error("Error in getWorkAssignmentsService: " + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách báo cáo công việc (work reports) cho một công việc
 * Bao gồm thông tin người báo cáo, phê duyệt
 */
export const getWorkReportsService = async (workId) => {
  try {
    const reports = await db.WorkReport.findAll({
      where: { work_id: workId },
      attributes: [
        "id",
        "work_id",
        "progress_percentage",
        "status",
        "description",
        "notes",
        "title",
        "location",
        "before_images",
        "during_images",
        "after_images",
        "materials_used",
        "issues_encountered",
        "solution_applied",
        "time_spent_hours",
        "next_steps",
        "approval_status",
        "quality_rating",
        "rejection_reason",
        "reported_at",
        "approved_at",
        "created_at",
        "reported_by",
        "approved_by",
        "assigned_approver",
      ],
      include: [
        {
          model: db.User,
          as: "reporter",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
        },
        {
          model: db.User,
          as: "approver",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
        },
        {
          model: db.User,
          as: "assignedApprover",
          attributes: ["id", "name", "email", "phone", "avatar_url", "position"],
        },
      ],
      order: [["reported_at", "DESC"]],
    });

    return { success: true, data: reports };
  } catch (error) {
    logger.error("Error in getWorkReportsService: " + error.message);
    throw error;
  }
};

/**
 * Tạo công việc mới (Phase 1: Basic work creation without technician assignment)
 */
export const createWorkService = async (workData) => {
  try {
    const {
      work_code,
      title,
      description,
      category_id,
      assigned_to_technician_id,
      assigned_user_id, // Manager or sales person assigning the work
      created_by_sales_id,
      priority,
      status,
      notes,
      service_type,
      due_date,
      location,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
      project_id,
    } = workData;

    if (!title || !assigned_user_id) {
      throw new Error("Thiếu thông tin bắt buộc: title, assigned_user_id");
    }

    // Validate foreign key references
    const assignedUser = await db.User.findByPk(assigned_user_id);
    if (!assignedUser) {
      throw new Error("Người dùng được giao không tồn tại");
    }

    if (category_id) {
      const category = await db.WorkCategory.findByPk(category_id);
      if (!category) {
        throw new Error("Danh mục công việc không tồn tại");
      }
    }

    if (project_id) {
      const project = await db.Project.findByPk(project_id);
      if (!project) {
        throw new Error("Dự án không tồn tại");
      }
    }

    if (created_by_sales_id) {
      const salesPerson = await db.User.findByPk(created_by_sales_id);
      if (!salesPerson) {
        throw new Error("Nhân viên kinh doanh không tồn tại");
      }
    }

    // Ensure work_code exists and uses system string format when not provided
    const generatedWorkCode = work_code || `lqd_work_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const timeSlotValue =
      workData.timeSlot !== undefined && workData.timeSlot !== null
        ? workData.timeSlot
        : workData.required_time_hour
        ? parseInt(String(workData.required_time_hour), 10)
        : null;

    const work = await db.Work.create({
      work_code: generatedWorkCode,
      title,
      description,
      category_id,
      assigned_user_id,
      assigned_to_technician_id,
      created_by_sales_id,
      priority: priority || "medium",
      status: status || "pending",
      service_type,
      due_date,
      required_date: workData.required_date || null,
      required_time_hour: workData.required_time_hour || null,
      required_time_minute: workData.required_time_minute || null,
      timeSlot: timeSlotValue,
      location,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
      project_id,
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: work.id,
        action: "created",
        changed_by: assigned_user_id,
        notes: "Công việc được tạo",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for creation: " + historyError.message);
    }

    // Create notification for assigned user
    try {
      await createNotificationService({
        user_id: assigned_user_id,
        title: "Công việc mới được giao",
        message: `Công việc "${title}" đã được tạo và giao cho bạn.`,
        type: "work_assigned",
        related_work_id: work.id,
        action_url: `/works/${work.id}`,
      });
    } catch (notificationError) {
      logger.error("Failed to create notification for work creation: " + notificationError.message);
    }

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in createWorkService: " + error.message);
    throw error;
  }
};

/**
 * Cập nhật công việc (including optional technician assignment if needed)
 */
export const updateWorkService = async (id, updateData) => {
  try {
    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Kiểm tra assigned_user_id nếu được cung cấp
    if (updateData.assigned_user_id) {
      const assignedUser = await db.User.findByPk(updateData.assigned_user_id);
      if (!assignedUser) {
        throw new Error("Người dùng được giao không tồn tại");
      }
    }

    // Kiểm tra category_id nếu được cung cấp
    if (updateData.category_id) {
      const category = await db.WorkCategory.findByPk(updateData.category_id);
      if (!category) {
        throw new Error("Danh mục công việc không tồn tại");
      }
    }

    // Kiểm tra project_id nếu được cung cấp
    if (updateData.project_id) {
      const project = await db.Project.findByPk(updateData.project_id);
      if (!project) {
        throw new Error("Dự án không tồn tại");
      }
    }

    // Kiểm tra created_by_sales_id nếu được cung cấp
    if (updateData.created_by_sales_id) {
      const salesPerson = await db.User.findByPk(updateData.created_by_sales_id);
      if (!salesPerson) {
        throw new Error("Nhân viên kinh doanh không tồn tại");
      }
    }

    // Removed technician assignment logic to separate phases
    await work.update({
      ...updateData,
      updated_at: new Date(),
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: id,
        action: "updated",
        changed_by: updateData.changed_by || work.assigned_user_id, // Use provided or existing
        notes: "Công việc được cập nhật",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for update: " + historyError.message);
    }

    // Create notification for assigned user
    try {
      await createNotificationService({
        user_id: work.assigned_user_id,
        title: "Công việc được cập nhật",
        message: `Công việc "${work.title}" đã được cập nhật.`,
        type: "work_updated",
        related_work_id: id,
        action_url: `/works/${id}`,
      });
    } catch (notificationError) {
      logger.error("Failed to create notification for work update: " + notificationError.message);
    }

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in updateWorkService: " + error.message);
    throw error;
  }
};

/**
 * Phê duyệt công việc
 */
export const approveWorkService = async (id, approvalData) => {
  try {
    const { approved_by, notes } = approvalData;

    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    if (work.status !== "pending") {
      throw new Error("Công việc không ở trạng thái chờ phê duyệt");
    }

    // Kiểm tra approved_by tồn tại
    if (approved_by) {
      const approver = await db.User.findByPk(approved_by);
      if (!approver) {
        throw new Error("Người phê duyệt không tồn tại");
      }
    }

    // Update work status
    await work.update({
      status: "assigned",
      updated_at: new Date(),
    });

    // Create approval workflow record
    await db.ApprovalWorkflow.create({
      work_id: id,
      approved_by,
      status: "approved",
      notes,
      approved_at: new Date(),
    });

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: id,
        action: "approved",
        changed_by: approved_by,
        notes: "Công việc được phê duyệt",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for approval: " + historyError.message);
    }

    // Create notification for assigned user
    try {
      await createNotificationService({
        user_id: work.assigned_user_id,
        title: "Công việc được phê duyệt",
        message: `Công việc "${work.title}" đã được phê duyệt và sẵn sàng để thực hiện.`,
        type: "work_approved",
        related_work_id: id,
        action_url: `/works/${id}`,
      });
    } catch (notificationError) {
      logger.error("Failed to create notification for work approval: " + notificationError.message);
    }

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in approveWorkService: " + error.message);
    throw error;
  }
};

/**
 * Xóa công việc
 */
export const deleteWorkService = async (id) => {
  try {
    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Log work history before deletion
    try {
      await createWorkHistoryService({
        work_id: id,
        action: "deleted",
        changed_by: work.assigned_user_id,
        notes: "Công việc bị xóa",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for deletion: " + historyError.message);
    }

    // Create notification for assigned user before deletion
    try {
      await createNotificationService({
        user_id: work.assigned_user_id,
        title: "Công việc bị xóa",
        message: `Công việc "${work.title}" đã bị xóa khỏi hệ thống.`,
        type: "work_deleted",
        related_work_id: id,
        action_url: `/works`, // Redirect to works list since the specific work is deleted
      });
    } catch (notificationError) {
      logger.error("Failed to create notification for work deletion: " + notificationError.message);
    }

    await work.destroy();

    return { success: true, message: "Xóa công việc thành công" };
  } catch (error) {
    logger.error("Error in deleteWorkService: " + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách danh mục công việc
 */
export const getWorkCategoriesService = async () => {
  try {
    const categories = await db.WorkCategory.findAll({
      attributes: ["id", "name"],
    });
    return { success: true, data: categories };
  } catch (error) {
    logger.error("Error in getWorkCategoriesService: " + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách loại dịch vụ
 */
export const getServiceTypesService = async () => {
  try {
    // Assuming service types are predefined or from a model
    // For now, return hardcoded list as per TrackWorks.jsx
    const serviceTypes = [
      { id: 1, name: "Maintenance" },
      { id: 2, name: "Installation" },
      { id: 3, name: "Repair" },
      { id: 4, name: "Inspection" },
      { id: 5, name: "Consultation" },
    ];
    return { success: true, data: serviceTypes };
  } catch (error) {
    logger.error("Error in getServiceTypesService: " + error.message);
    throw error;
  }
};

/**
 * Export công việc
 */
export const exportWorksService = async (queryParams) => {
  try {
    const { dateRange = "all", status, format = "csv" } = queryParams;

    const where = {};
    if (status) where.status = status;

    // Date range (same logic)
    const now = new Date();
    let startDate, endDate;
    switch (dateRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "thisWeek":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        break;
    }
    if (startDate && endDate) {
      where.created_date = { [Op.between]: [startDate, endDate] };
    }

    const works = await db.Work.findAll({
      where,
      include: [
        {
          model: db.WorkCategory,
          as: "category",
          attributes: ["name"],
        },
        { model: db.User, as: "assignedUser", attributes: ["name"] },
        { model: db.User, as: "technician", attributes: ["name"] },
      ],
      raw: true,
    });

    if (format === "csv") {
      const fields = [
        "work_code",
        "title",
        "description",
        "category.name",
        "assignedUser.name",
        "technician.name",
        "priority",
        "status",
        "service_type",
        "due_date",
        "location",
        "customer_name",
        "customer_phone",
        "customer_address",
        "estimated_hours",
        "actual_hours",
        "estimated_cost",
        "actual_cost",
        "payment_status",
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(works);
      return { success: true, data: csv, contentType: "text/csv" };
    } else if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Works");

      worksheet.columns = [
        { header: "Work Code", key: "work_code" },
        { header: "Title", key: "title" },
        { header: "Description", key: "description" },
        { header: "Category", key: "category.name" },
        { header: "Assigned User", key: "assignedUser.name" },
        { header: "Technician", key: "technician.name" },
        { header: "Priority", key: "priority" },
        { header: "Status", key: "status" },
        { header: "Service Type", key: "service_type" },
        { header: "Due Date", key: "due_date" },
        { header: "Location", key: "location" },
        { header: "Customer Name", key: "customer_name" },
        { header: "Customer Phone", key: "customer_phone" },
        { header: "Customer Address", key: "customer_address" },
        { header: "Estimated Hours", key: "estimated_hours" },
        { header: "Actual Hours", key: "actual_hours" },
        { header: "Estimated Cost", key: "estimated_cost" },
        { header: "Actual Cost", key: "actual_cost" },
        { header: "Payment Status", key: "payment_status" },
      ];

      works.forEach((work) => {
        worksheet.addRow(work);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return {
        success: true,
        data: buffer,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    }

    throw new Error("Unsupported format");
  } catch (error) {
    logger.error("Error in exportWorksService: " + error.message);
    throw error;
  }
};

/**
 * Lấy công việc theo trạng thái
 */
export const getWorksByStatusService = async (status) => {
  try {
    const works = await db.Work.findAll({
      where: { status },
      include: [
        { model: db.WorkCategory, as: "category" },
        { model: db.User, as: "assignedUser" },
        { model: db.User, as: "salesPerson" },
      ],
    });
    return { success: true, data: works };
  } catch (error) {
    logger.error("Error in getWorksByStatusService: " + error.message);
    throw error;
  }
};

/**
 * Lấy danh sách công việc với filters, pagination, search, sort
 */
export const getWorksService = async (queryParams) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      priority,
      category_id,
      date,
      dateRange = "all",
      sortBy = "created_date",
      order = "desc",
    } = queryParams;

    const where = {};
    const include = [
      { model: db.WorkCategory, as: "category" },
      { model: db.User, as: "assignedUser" },
      { model: db.User, as: "salesPerson" },
      { model: db.Project, as: "project" },
      {
        model: db.WorkAssignment,
        as: "assignments",
        include: [
          {
            model: db.User,
            as: "technician",
            attributes: ["id", "name", "email", "phone", "avatar_url"],
          },
          {
            model: db.User,
            as: "assignedByUser",
            attributes: ["id", "name", "email"],
          },
        ],
      },
    ];

    // Search
    if (search) {
      where[Op.or] = [
        { work_code: { [Op.like]: `%${search}%` } },
        { title: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category_id) where.category_id = category_id;

    // Date range
    const now = new Date();
    let startDate, endDate;
    switch (dateRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "thisWeek":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        // all
        break;
    }
    if (startDate && endDate) {
      where.created_date = { [Op.between]: [startDate, endDate] };
    }

    // Specific date
    if (date) {
      const specificDate = new Date(date);
      where.created_date = {
        [Op.gte]: specificDate,
        [Op.lt]: new Date(specificDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    // Sort
    const orderBy = [[sortBy, order.toUpperCase()]];

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Work.findAndCountAll({
      where,
      include,
      order: orderBy,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: {
        data: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    };
  } catch (error) {
    logger.error("Error in getWorksService: " + error.message);
    throw error;
  }
};

/**
 * Lấy thống kê công việc
 */
export const getWorksStatisticsService = async (dateRange = "all") => {
  try {
    const where = {};

    // Date range
    const now = new Date();
    let startDate, endDate;
    switch (dateRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "thisWeek":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        break;
    }
    if (startDate && endDate) {
      where.created_date = { [Op.between]: [startDate, endDate] };
    }

    const totalWorks = await db.Work.count({ where });
    const completedWorks = await db.Work.count({
      where: { ...where, status: "completed" },
    });
    const inProgressWorks = await db.Work.count({
      where: { ...where, status: "in_progress" },
    });
    const overduedWorks = await db.Work.count({
      where: {
        ...where,
        due_date: { [Op.lt]: new Date() },
        status: { [Op.ne]: "completed" },
      },
    });
    const pendingApprovalWorks = await db.Work.count({
      where: { ...where, status: "pending" },
    });

    const sums = await db.Work.findAll({
      where,
      attributes: [
        [db.sequelize.fn("SUM", db.sequelize.col("estimated_hours")), "totalEstimatedHours"],
        [db.sequelize.fn("SUM", db.sequelize.col("actual_hours")), "totalActualHours"],
        [db.sequelize.fn("SUM", db.sequelize.col("estimated_cost")), "totalEstimatedCost"],
        [db.sequelize.fn("SUM", db.sequelize.col("actual_cost")), "totalActualCost"],
      ],
      raw: true,
    });

    const stats = sums[0] || {};

    return {
      success: true,
      data: {
        totalWorks,
        completedWorks,
        inProgressWorks,
        overduedWorks,
        pendingApprovalWorks,
        totalEstimatedHours: parseFloat(stats.totalEstimatedHours || 0),
        totalActualHours: parseFloat(stats.totalActualHours || 0),
        totalEstimatedCost: parseFloat(stats.totalEstimatedCost || 0),
        totalActualCost: parseFloat(stats.totalActualCost || 0),
      },
    };
  } catch (error) {
    logger.error("Error in getWorksStatisticsService: " + error.message);
    throw error;
  }
};

/**
 * Lấy phân bố công việc theo status và priority
 */
export const getWorksDistributionService = async (dateRange = "all") => {
  try {
    const where = {};

    // Date range (same as above)
    const now = new Date();
    let startDate, endDate;
    switch (dateRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case "thisWeek":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        break;
    }
    if (startDate && endDate) {
      where.created_date = { [Op.between]: [startDate, endDate] };
    }

    const total = await db.Work.count({ where });

    // Status distribution
    const statusGroups = await db.Work.findAll({
      where,
      attributes: ["status", [db.sequelize.fn("COUNT", db.sequelize.col("status")), "count"]],
      group: ["status"],
      raw: true,
    });

    const statusDistribution = statusGroups.map((group) => ({
      status: group.status,
      count: parseInt(group.count),
      percentage: total > 0 ? ((parseInt(group.count) / total) * 100).toFixed(2) : 0,
    }));

    // Priority distribution
    const priorityGroups = await db.Work.findAll({
      where,
      attributes: ["priority", [db.sequelize.fn("COUNT", db.sequelize.col("priority")), "count"]],
      group: ["priority"],
      raw: true,
    });

    const priorityDistribution = priorityGroups.map((group) => ({
      priority: group.priority,
      count: parseInt(group.count),
      percentage: total > 0 ? ((parseInt(group.count) / total) * 100).toFixed(2) : 0,
    }));

    return {
      success: true,
      data: {
        statusDistribution,
        priorityDistribution,
      },
    };
  } catch (error) {
    logger.error("Error in getWorksDistributionService: " + error.message);
    throw error;
  }
};
