import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";

/**
 * Lấy danh sách tất cả công việc
 */
export const getAllWorksService = async () => {
  try {
    const works = await db.Work.findAll({
      include: [
        { model: db.WorkCategory, as: "category" },
        { model: db.User, as: "assignedUser" },
        { model: db.User, as: "technician" },
        { model: db.User, as: "salesPerson" },
      ],
    });
    return { success: true, data: works };
  } catch (error) {
    logger.error("Error in getAllWorksService:", error.message);
    throw error;
  }
};

/**
 * Lấy công việc theo ID
 */
export const getWorkByIdService = async (id) => {
  try {
    const work = await db.Work.findByPk(id, {
      include: [
        { model: db.WorkCategory, as: "category" },
        { model: db.User, as: "assignedUser" },
        { model: db.User, as: "technician" },
        { model: db.User, as: "salesPerson" },
      ],
    });
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }
    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in getWorkByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo công việc mới
 */
export const createWorkService = async (workData) => {
  try {
    const {
      work_code,
      title,
      description,
      category_id,
      assigned_user_id,
      assigned_to_technician_id,
      created_by_sales_id,
      priority,
      status,
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

    // work_code is now auto-generated UUID, so no need to check uniqueness

    const work = await db.Work.create({
      work_code, // will be auto-generated if not provided
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

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in createWorkService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật công việc
 */
export const updateWorkService = async (id, updateData) => {
  try {
    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    await work.update({
      ...updateData,
      updated_at: new Date(),
    });

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in updateWorkService:", error.message);
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

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in approveWorkService:", error.message);
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

    await work.destroy();

    return { success: true, message: "Xóa công việc thành công" };
  } catch (error) {
    logger.error("Error in deleteWorkService:", error.message);
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
    logger.error("Error in getWorkCategoriesService:", error.message);
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
    logger.error("Error in getServiceTypesService:", error.message);
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
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
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
        { model: db.WorkCategory, as: "category", attributes: ["name"] },
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
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    }

    throw new Error("Unsupported format");
  } catch (error) {
    logger.error("Error in exportWorksService:", error.message);
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
        { model: db.User, as: "technician" },
      ],
    });
    return { success: true, data: works };
  } catch (error) {
    logger.error("Error in getWorksByStatusService:", error.message);
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
      { model: db.User, as: "technician" },
      { model: db.User, as: "salesPerson" },
      { model: db.Project, as: "project" },
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
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
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
    logger.error("Error in getWorksService:", error.message);
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
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
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
        [
          db.sequelize.fn("SUM", db.sequelize.col("estimated_hours")),
          "totalEstimatedHours",
        ],
        [
          db.sequelize.fn("SUM", db.sequelize.col("actual_hours")),
          "totalActualHours",
        ],
        [
          db.sequelize.fn("SUM", db.sequelize.col("estimated_cost")),
          "totalEstimatedCost",
        ],
        [
          db.sequelize.fn("SUM", db.sequelize.col("actual_cost")),
          "totalActualCost",
        ],
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
    logger.error("Error in getWorksStatisticsService:", error.message);
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
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
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
      attributes: [
        "status",
        [db.sequelize.fn("COUNT", db.sequelize.col("status")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const statusDistribution = statusGroups.map((group) => ({
      status: group.status,
      count: parseInt(group.count),
      percentage:
        total > 0 ? ((parseInt(group.count) / total) * 100).toFixed(2) : 0,
    }));

    // Priority distribution
    const priorityGroups = await db.Work.findAll({
      where,
      attributes: [
        "priority",
        [db.sequelize.fn("COUNT", db.sequelize.col("priority")), "count"],
      ],
      group: ["priority"],
      raw: true,
    });

    const priorityDistribution = priorityGroups.map((group) => ({
      priority: group.priority,
      count: parseInt(group.count),
      percentage:
        total > 0 ? ((parseInt(group.count) / total) * 100).toFixed(2) : 0,
    }));

    return {
      success: true,
      data: {
        statusDistribution,
        priorityDistribution,
      },
    };
  } catch (error) {
    logger.error("Error in getWorksDistributionService:", error.message);
    throw error;
  }
};
