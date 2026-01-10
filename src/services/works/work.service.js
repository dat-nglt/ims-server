import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import { createWorkHistoryService } from "./work-history.service.js";
import { createNotificationService } from "../operations/notification.service.js";

/**
 * Lấy danh sách tất cả công việc
 * Hỗ trợ query.fields (ví dụ: "title,id") để chỉ trả về các trường cần thiết
 */
export const getAllWorksService = async (query = {}) => {
  try {
    // If client requests specific fields (e.g., ?fields=title,id)
    if (query.fields) {
      const requested = query.fields.split(",").map((f) => f.trim());

      // Only accept DB column names (use 'title' — do not accept 'name' alias)
      const attributes = requested;

      // Order by title if requested, otherwise by id
      const orderField = attributes.includes("title") ? "title" : "id";

      const works = await db.Work.findAll({ attributes, order: [[orderField, "ASC"]] });
      const rows = works.map((w) => w.toJSON());

      return { success: true, data: rows, message: "Lấy danh sách công việc thành công" };
    }

    // Default: return full works with relations
    const works = await db.Work.findAll({
      include: [
        // { model: db.WorkCategory, as: "category", attributes: ["id", "name"] },
        { model: db.Project, as: "project", attributes: ["id", "name"] },
        {
          model: db.WorkAssignment,
          as: "assignments",
          attributes: ["id", "work_id", "technician_id"],
          where: { assigned_status: { [Op.ne]: "cancelled" } }, // Loại bỏ các assignment đã bị hủy
          required: false, // LEFT JOIN để không loại bỏ các work không có assignment
        },
        { model: db.User, as: "salesPerson", attributes: ["id", "name", "employee_id", "avatar_url", "phone"] },
      ],
    });
    return { success: true, data: works, message: "Lấy danh sách công việc thành công" };
  } catch (error) {
    logger.error("Error in getAllWorksService: " + error.message);
    return { success: false, data: [], message: "Lấy danh sách công việc thất bại: " + error.message };
  }
};

// Lấy danh sách kỹ thuật viên để phân công
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

// Lấy thông tin công việc theo mã công việc
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

// Lấy thông tin công việc theo ID
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
 * Tạo công việc mới
 * - Thực hiện validation các trường bắt buộc và hợp lệ
 * - Tạo bản ghi `Work` trong DB (trong 1 transaction)
 * - Ghi lịch sử tạo công việc (non-blocking)
 * - Tạo `WorkAssignment` cho kỹ thuật viên (nếu có) và gửi notification (best-effort)
 *
 * Lưu ý: phần side-effects sau khi tạo `Work` (log lịch sử, gửi notification, tạo assignment)
 * được thực hiện không chặn và thất bại ở bước này không rollback được record `Work` đã tạo.
 */
export const createWorkService = async (workData) => {
  let transaction = null;
  try {
    // Destructure input
    const {
      work_code,
      title,
      description,
      category_id,
      assigned_to_technician_id,
      created_by,
      created_by_sales_id,
      priority,
      status,
      notes,
      due_date,
      required_date,
      required_time_hour,
      required_time_minute,
      timeSlot,
      location,
      customer_id,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
      payment_status,
      is_active,
      expires_at,
      project_id,
    } = workData;

    // --- 1) Kiểm tra các trường bắt buộc ---
    const requiredChecks = {
      title,
      description,
      category_id,
      created_by_sales_id,
      created_by,
      required_date,
      location,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
    };

    const missing = Object.entries(requiredChecks)
      .filter(([, v]) => v === undefined || v === null || (typeof v === "string" && v.trim() === ""))
      .map(([k]) => k);

    if (missing.length) {
      throw new Error(`Thiếu thông tin bắt buộc: ${missing.join(", ")}`);
    }

    // --- 2) Kiểm tra FK tồn tại ---
    const [creator, salesPerson, category] = await Promise.all([
      db.User.findByPk(created_by),
      db.User.findByPk(created_by_sales_id),
      db.WorkCategory.findByPk(category_id),
    ]);

    if (!creator) throw new Error("Người tạo công việc không tồn tại trong hệ thống");
    if (!salesPerson) throw new Error("Nhân viên kinh doanh không tồn tại trong hệ thống");
    if (!category) throw new Error("Danh mục công việc không tồn tại trong hệ thống");

    if (project_id) {
      const project = await db.Project.findByPk(project_id);
      if (!project) throw new Error("Dự án không tồn tại");
    }

    if (customer_id) {
      const customer = await db.Customer.findByPk(customer_id);
      if (!customer) throw new Error("Khách hàng không tồn tại");
    }

    // --- 3) Validate ngày/giờ ---
    const reqDate = new Date(required_date);
    if (isNaN(reqDate.getTime())) throw new Error("Ngày yêu cầu thực hiện không hợp lệ");

    const normalizeHour = (val) => {
      if (val === undefined || val === null || val === "") return null;
      const s = String(val);
      if (!/^\d{1,2}$/.test(s)) throw new Error("Giờ yêu cầu phải có định dạng HH");
      const n = parseInt(s, 10);
      if (n < 0 || n > 23) throw new Error("Giờ yêu cầu phải từ 0 đến 23");
      return String(n).padStart(2, "0");
    };
    const normalizeMinute = (val) => {
      if (val === undefined || val === null || val === "") return null;
      const s = String(val);
      if (!/^\d{1,2}$/.test(s)) throw new Error("Phút yêu cầu phải có định dạng MM");
      const n = parseInt(s, 10);
      if (n < 0 || n > 59) throw new Error("Phút yêu cầu phải từ 0 đến 59");
      return String(n).padStart(2, "0");
    };

    const normHour = normalizeHour(required_time_hour);
    const normMinute = normalizeMinute(required_time_minute);

    // --- 4) Validate GPS ---
    const lat = parseFloat(location_lat);
    const lng = parseFloat(location_lng);
    if (isNaN(lat) || lat < -90 || lat > 90) throw new Error("Vĩ độ (latitude) phải nằm trong khoảng [-90, 90]");
    if (isNaN(lng) || lng < -180 || lng > 180) throw new Error("Kinh độ (longitude) phải nằm trong khoảng [-180, 180]");

    // --- 5) Validate phone ---
    if (typeof customer_phone === "string" && customer_phone.length > 20) {
      throw new Error("Số điện thoại khách hàng tối đa 20 ký tự");
    }

    // --- 6) Validate số/tiền ---
    const estHours = Number(estimated_hours);
    if (isNaN(estHours) || estHours < 0 || estHours > 999.99) throw new Error("Giờ ước tính phải từ 0 đến 999.99");

    const estCost = Number(estimated_cost);
    if (isNaN(estCost) || estCost < 0 || estCost > 9999999.99)
      throw new Error("Chi phí ước tính phải từ 0 đến 9999999.99");

    // --- 7) Validate payment status ---
    const validPaymentStatuses = ["unpaid", "paid", "partial"];
    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      throw new Error(`Trạng thái thanh toán phải là: ${validPaymentStatuses.join(", ")}`);
    }

    // --- 8) Chuẩn bị payload ---
    const generatedWorkCode = work_code || `lqd_work_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // timeSlot: ưu tiên giá trị timeSlot truyền vào (nếu >0), sau đó dùng giờ yêu cầu normalized, nếu không có thì null
    const timeSlotValue =
      timeSlot !== undefined && timeSlot !== null && Number(timeSlot) > 0
        ? Number(timeSlot)
        : normHour !== null
        ? Math.max(0, parseInt(String(normHour), 10))
        : null;

    const payload = {
      work_code: generatedWorkCode,
      title: String(title).trim(),
      description: String(description).trim(),
      notes: notes || null,
      category_id: Number(category_id),
      project_id: project_id ? Number(project_id) : null,
      created_by: Number(created_by),
      created_by_sales_id: Number(created_by_sales_id),
      priority: priority || "medium",
      status: status || "pending",
      service_type: project_id ? "Dự án" : "Công việc dịch vụ",
      due_date: due_date || null,
      required_date: reqDate,
      required_time_hour: normHour,
      required_time_minute: normMinute,
      timeSlot: timeSlotValue,
      created_date: new Date(),
      location: String(location).trim(),
      customer_id: customer_id ? Number(customer_id) : null,
      customer_name: String(customer_name).trim(),
      customer_phone: String(customer_phone).trim(),
      customer_address: String(customer_address).trim(),
      location_lat: lat,
      location_lng: lng,
      estimated_hours: estHours,
      estimated_cost: estCost,
      payment_status: payment_status || "unpaid",
      is_active: is_active !== undefined ? Boolean(is_active) : true,
      expires_at: expires_at || null,
    };

    // --- 9) Tạo Work trong transaction để đảm bảo tính nguyên tử tối thiểu ---
    transaction = await db.sequelize.transaction();
    let work;
    try {
      work = await db.Work.create(payload, { transaction });
      await transaction.commit();
      transaction = null;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
        transaction = null;
      }

      // Thông báo lỗi rõ ràng cho các lỗi Sequelize thường gặp
      if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message).join("; ");
        logger.error(`Sequelize validation error creating work: ${messages}`);
        throw new Error(`Validation error: ${messages}`);
      }
      if (err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors.map((e) => e.message).join("; ");
        logger.error(`Sequelize unique constraint error creating work: ${messages}`);
        throw new Error(`Duplicate value error: ${messages}`);
      }
      throw err;
    }

    // --- 10) Ghi lịch sử (non-blocking) ---
    (async () => {
      try {
        await createWorkHistoryService({
          work_id: work.id,
          action: "created",
          changed_by: payload.created_by,
          notes: "Công việc được tạo",
        });
      } catch (historyError) {
        logger.error("Failed to log work history for creation: " + historyError.message);
      }
    })();

    // --- 11) Xử lý phân công kỹ thuật viên nếu có ---
    const parseTechnicianIds = (val) => {
      if (val === undefined || val === null || val === "") return [];
      if (Array.isArray(val)) return val.map((x) => Number(x)).filter((n) => !isNaN(n));
      if (typeof val === "string")
        return val
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));
      const n = Number(val);
      return !isNaN(n) ? [n] : [];
    };

    const assignedTechnicianIds = parseTechnicianIds(assigned_to_technician_id);
    const createdAssignments = [];

    for (const techId of assignedTechnicianIds) {
      try {
        const technician = await db.User.findByPk(techId);
        if (!technician) {
          logger.warn(`Technician id ${techId} not found, skipping assignment`);
          continue;
        }

        const assignment = await db.WorkAssignment.create({
          work_id: work.id,
          technician_id: techId,
          assigned_by: payload.created_by,
          assignment_date: new Date(),
          assigned_status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
        });
        createdAssignments.push(assignment);
      } catch (assignmentErr) {
        logger.error("Failed to create assignment for technician " + techId + ": " + assignmentErr.message);
      }
    }

    // --- 12) Tải lại work kèm relations để trả về client ---
    try {
      const createdWork = await db.Work.findByPk(work.id, {
        include: [
          { model: db.WorkCategory, as: "category", attributes: ["id", "name"] },
          { model: db.User, as: "salesPerson", attributes: ["id", "name", "email"] },
          { model: db.Project, as: "project" },
          {
            model: db.WorkAssignment,
            as: "assignments",
            include: [
              {
                model: db.User,
                as: "technician",
                attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
              },
            ],
            order: [["assignment_date", "DESC"]],
          },
        ],
      });

      // Non-blocking: tạo thông báo hệ thống về tạo công việc mới
      (async () => {
        try {
          // System notification about work creation
          await createNotificationService({
            title: `Công việc mới: ${createdWork.title}`,
            message: `Công việc "${createdWork.title}" đã được tạo thành công.`,
            type: "work_created",
            related_work_id: createdWork.id,
            priority: "medium",
            broadcast: false,
            systemNotification: {
              title: `Công việc mới được tạo: ${createdWork.title}`,
              message: `Công việc "${createdWork.title}" đã được tạo trong hệ thống.`,
              broadcast: false,
            },
          });
          logger.info(`System notification for work creation created for work id: ${createdWork.id}`);
        } catch (err) {
          logger.error("Failed to create system notification for work creation: " + err.message);
        }

        // Notification for assigned technicians
        try {
          if (createdAssignments && createdAssignments.length > 0) {
            const newAssignedIds = createdAssignments.map((a) => a.technician_id);
            await createNotificationService({
              title: "Bạn có công việc mới",
              message: `Công việc "${createdWork.title}" đã được giao cho bạn.`,
              type: "work_assigned",
              related_work_id: createdWork.id,
              action_url: `/works/${createdWork.id}`,
              priority: "high",
              recipients: newAssignedIds,
            });
            logger.info(
              `Assignment notification sent to ${newAssignedIds.length} technician(s) for work id: ${createdWork.id}`
            );
          }
        } catch (err) {
          logger.error("Failed to create assignment notification: " + err.message);
        }
      })();

      return { success: true, data: createdWork };
    } catch (reloadErr) {
      // Nếu reload thất bại, vẫn trả về thông tin work cơ bản và danh sách id đã cố gắng phân công
      logger.error("Error while reloading created work: " + reloadErr.message);
      return { success: true, data: work };
    }
  } catch (error) {
    // rollback nếu transaction còn mở
    if (transaction) await transaction.rollback();
    logger.error("Error in createWorkService: " + error.message);
    throw error;
  }
};

/**
 * Cập nhật công việc với validation tương tự createWorkService
 */
export const updateWorkService = async (id, updateData) => {
  let transaction = null;
  try {
    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // --- FK validations (if provided) ---
    if (updateData.created_by) {
      const creator = await db.User.findByPk(updateData.created_by);
      if (!creator) {
        throw new Error("Người tạo công việc không tồn tại");
      }
    }

    if (updateData.category_id) {
      const category = await db.WorkCategory.findByPk(updateData.category_id);
      if (!category) {
        throw new Error("Danh mục công việc không tồn tại");
      }
    }

    if (updateData.project_id) {
      const project = await db.Project.findByPk(updateData.project_id);
      if (!project) {
        throw new Error("Dự án không tồn tại");
      }
    }

    if (updateData.created_by_sales_id) {
      const salesPerson = await db.User.findByPk(updateData.created_by_sales_id);
      if (!salesPerson) {
        throw new Error("Nhân viên kinh doanh không tồn tại");
      }
    }

    if (updateData.customer_id) {
      const customer = await db.Customer.findByPk(updateData.customer_id);
      if (!customer) {
        throw new Error("Khách hàng không tồn tại");
      }
    }

    // --- Validate and normalize date/time if provided ---
    if (updateData.required_date !== undefined && updateData.required_date !== null) {
      const reqDate = new Date(updateData.required_date);
      if (isNaN(reqDate.getTime())) throw new Error("Ngày yêu cầu thực hiện không hợp lệ");
      updateData.required_date = reqDate;
    }

    const normalizeHour = (val) => {
      if (val === undefined || val === null || val === "") return null;
      const s = String(val);
      if (!/^\d{1,2}$/.test(s)) throw new Error("Giờ yêu cầu phải có định dạng HH");
      const n = parseInt(s, 10);
      if (n < 0 || n > 23) throw new Error("Giờ yêu cầu phải từ 0 đến 23");
      return String(n).padStart(2, "0");
    };
    const normalizeMinute = (val) => {
      if (val === undefined || val === null || val === "") return null;
      const s = String(val);
      if (!/^\d{1,2}$/.test(s)) throw new Error("Phút yêu cầu phải có định dạng MM");
      const n = parseInt(s, 10);
      if (n < 0 || n > 59) throw new Error("Phút yêu cầu phải từ 0 đến 59");
      return String(n).padStart(2, "0");
    };

    if (updateData.required_time_hour !== undefined) {
      updateData.required_time_hour = normalizeHour(updateData.required_time_hour);
    }
    if (updateData.required_time_minute !== undefined) {
      updateData.required_time_minute = normalizeMinute(updateData.required_time_minute);
    }

    // --- Validate GPS ---
    if (updateData.location_lat !== undefined && updateData.location_lat !== null) {
      const lat = parseFloat(updateData.location_lat);
      if (isNaN(lat) || lat < -90 || lat > 90) throw new Error("Vĩ độ (latitude) phải nằm trong khoảng [-90, 90]");
      updateData.location_lat = lat;
    }
    if (updateData.location_lng !== undefined && updateData.location_lng !== null) {
      const lng = parseFloat(updateData.location_lng);
      if (isNaN(lng) || lng < -180 || lng > 180)
        throw new Error("Kinh độ (longitude) phải nằm trong khoảng [-180, 180]");
      updateData.location_lng = lng;
    }

    // --- Validate phone ---
    if (updateData.customer_phone !== undefined && updateData.customer_phone !== null) {
      if (typeof updateData.customer_phone === "string" && updateData.customer_phone.length > 20) {
        throw new Error("Số điện thoại khách hàng tối đa 20 ký tự");
      }
      updateData.customer_phone = String(updateData.customer_phone).trim();
    }

    // --- Validate numeric fields and coerce types ---
    if (updateData.estimated_hours !== undefined && updateData.estimated_hours !== null) {
      const hours = Number(updateData.estimated_hours);
      if (isNaN(hours) || hours < 0 || hours > 999.99) throw new Error("Giờ ước tính phải từ 0 đến 999.99");
      updateData.estimated_hours = hours;
    }

    if (updateData.estimated_cost !== undefined && updateData.estimated_cost !== null) {
      const cost = Number(updateData.estimated_cost);
      if (isNaN(cost) || cost < 0 || cost > 9999999.99) throw new Error("Chi phí ước tính phải từ 0 đến 9999999.99");
      updateData.estimated_cost = cost;
    }

    if (updateData.actual_hours !== undefined && updateData.actual_hours !== null) {
      const hours = Number(updateData.actual_hours);
      if (isNaN(hours) || hours < 0 || hours > 999.99) throw new Error("Giờ thực tế phải từ 0 đến 999.99");
      updateData.actual_hours = hours;
    }

    if (updateData.actual_cost !== undefined && updateData.actual_cost !== null) {
      const cost = Number(updateData.actual_cost);
      if (isNaN(cost) || cost < 0 || cost > 9999999.99) throw new Error("Chi phí thực tế phải từ 0 đến 9999999.99");
      updateData.actual_cost = cost;
    }

    // --- Validate payment/status/priority ---
    const validPaymentStatuses = ["unpaid", "paid", "partial"];
    if (updateData.payment_status && !validPaymentStatuses.includes(updateData.payment_status)) {
      throw new Error(`Trạng thái thanh toán phải là: ${validPaymentStatuses.join(", ")}`);
    }

    const validStatuses = ["pending", "assigned", "in_progress", "completed", "on_hold", "cancelled"];
    if (updateData.status && !validStatuses.includes(updateData.status)) {
      throw new Error(`Trạng thái phải là: ${validStatuses.join(", ")}`);
    }

    const validPriorities = ["low", "medium", "high", "urgent"];
    if (updateData.priority && !validPriorities.includes(updateData.priority)) {
      throw new Error(`Ưu tiên phải là: ${validPriorities.join(", ")}`);
    }

    // --- Perform update inside a transaction and handle common Sequelize errors ---
    transaction = await db.sequelize.transaction();
    try {
      await work.update(
        {
          ...updateData,
          updated_at: new Date(),
        },
        { transaction }
      );

      await transaction.commit();
      transaction = null;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
        transaction = null;
      }

      if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message).join("; ");
        logger.error(`Sequelize validation error updating work: ${messages}`);
        throw new Error(`Validation error: ${messages}`);
      }
      if (err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors.map((e) => e.message).join("; ");
        logger.error(`Sequelize unique constraint error updating work: ${messages}`);
        throw new Error(`Duplicate value error: ${messages}`);
      }

      throw err;
    }

    // --- Non-blocking: log work history ---
    (async () => {
      try {
        await createWorkHistoryService({
          work_id: id,
          action: "updated",
          changed_by: updateData.changed_by || work.created_by,
          notes: "Công việc được cập nhật",
        });
      } catch (historyError) {
        logger.error("Failed to log work history for update: " + historyError.message);
      }
    })();

    // --- Non-blocking: handle assignments if provided ---
    let createdAssignments = [];
    let cancelledAssignments = [];
    if (updateData.assigned_to_technician_id !== undefined) {
      const parseTechnicianIds = (val) => {
        if (val === undefined || val === null || val === "") return [];
        if (Array.isArray(val)) return val.map((x) => Number(x)).filter((n) => !isNaN(n));
        if (typeof val === "string")
          return val
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n));
        const n = Number(val);
        return !isNaN(n) ? [n] : [];
      };

      const newAssignedTechnicianIds = parseTechnicianIds(updateData.assigned_to_technician_id);

      // Get current assignments for this work
      const currentAssignments = await db.WorkAssignment.findAll({
        where: { work_id: id },
        attributes: ["id", "technician_id", "assigned_status"],
      });

      const currentTechnicianIds = currentAssignments.map((a) => a.technician_id);

      // 1. Add new technicians that are not yet assigned
      for (const techId of newAssignedTechnicianIds) {
        try {
          const technician = await db.User.findByPk(techId);
          if (!technician) {
            logger.warn(`Technician id ${techId} not found, skipping assignment`);
            continue;
          }

          // Check if already assigned
          const existing = await db.WorkAssignment.findOne({ where: { work_id: id, technician_id: techId } });
          if (existing) {
            logger.info(`Technician ${techId} already assigned to work ${id}, skipping`);
            continue;
          }

          const assignment = await db.WorkAssignment.create({
            work_id: id,
            technician_id: techId,
            assigned_by: updateData.changed_by || work.created_by,
            assignment_date: new Date(),
            assigned_status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
          });

          createdAssignments.push(assignment);
          logger.info(`Created assignment for technician ${techId} to work ${id}`);
        } catch (assignmentErr) {
          logger.error("Failed to create assignment for technician " + techId + ": " + assignmentErr.message);
        }
      }

      // 2. Cancel assignments for technicians that are no longer in the new list
      for (const currentAssignment of currentAssignments) {
        if (!newAssignedTechnicianIds.includes(currentAssignment.technician_id)) {
          try {
            // Only cancel if not already completed or cancelled
            if (!["completed", "cancelled"].includes(currentAssignment.assigned_status)) {
              await db.WorkAssignment.update(
                { assigned_status: "cancelled", updated_at: new Date() },
                { where: { id: currentAssignment.id } }
              );
              cancelledAssignments.push(currentAssignment);
              logger.info(
                `Cancelled assignment id ${currentAssignment.id} for technician ${currentAssignment.technician_id} from work ${id}`
              );
            }
          } catch (cancelErr) {
            logger.error("Failed to cancel assignment " + currentAssignment.id + ": " + cancelErr.message);
          }
        }
      }
    }

    // --- Reload updated work with relations before returning ---
    try {
      const updatedWork = await db.Work.findByPk(id, {
        include: [
          { model: db.WorkCategory, as: "category", attributes: ["id", "name"] },
          { model: db.User, as: "salesPerson", attributes: ["id", "name", "email"] },
          { model: db.Project, as: "project" },
          {
            model: db.WorkAssignment,
            as: "assignments",
            include: [
              {
                model: db.User,
                as: "technician",
                attributes: ["id", "name", "email", "phone", "avatar_url", "position_id"],
              },
            ],
            order: [["assignment_date", "DESC"]],
          },
        ],
      });

      // Non-blocking: tạo thông báo hệ thống về cập nhật công việc
      (async () => {
        try {
          // System notification about the update
          await createNotificationService({
            title: `Cập nhật công việc: ${updatedWork.title}`,
            message: `Công việc "${updatedWork.title}" đã được cập nhật.`,
            type: "work_updated",
            related_work_id: updatedWork.id,
            priority: "medium",
            broadcast: true,
            meta: {
              work_snapshot: {
                id: updatedWork.id,
                title: updatedWork.title,
                status: updatedWork.status,
                priority: updatedWork.priority,
              },
            },
          });

          logger.info(`System notification for work update created for work id: ${updatedWork.id}`);
        } catch (err) {
          logger.error("Failed to create system notification for work update: " + err.message);
        }

        // Notification for newly assigned technicians
        try {
          if (createdAssignments && createdAssignments.length > 0) {
            const newAssignedIds = createdAssignments.map((a) => a.technician_id);
            await createNotificationService({
              title: "Bạn có công việc mới",
              message: `Công việc "${updatedWork.title}" đã được giao cho bạn.`,
              type: "work_assigned",
              related_work_id: updatedWork.id,
              action_url: `/works/${updatedWork.id}`,
              priority: "high",
              recipients: newAssignedIds,
            });
            logger.info(
              `Assignment notification sent to ${newAssignedIds.length} technician(s) for work id: ${updatedWork.id}`
            );
          }
        } catch (err) {
          logger.error("Failed to create assignment notification: " + err.message);
        }

        // Notification for cancelled assignments
        try {
          if (cancelledAssignments && cancelledAssignments.length > 0) {
            const cancelledTechnicianIds = cancelledAssignments.map((a) => a.technician_id);
            await createNotificationService({
              title: "Công việc được hủy giao",
              message: `Công việc "${updatedWork.title}" không còn được giao cho bạn.`,
              type: "work_unassigned",
              related_work_id: updatedWork.id,
              priority: "medium",
              recipients: cancelledTechnicianIds,
            });
            logger.info(
              `Unassignment notification sent to ${cancelledTechnicianIds.length} technician(s) for work id: ${updatedWork.id}`
            );
          }
        } catch (err) {
          logger.error("Failed to create unassignment notification: " + err.message);
        }
      })();

      return { success: true, data: updatedWork, message: "Cập nhật công việc thành công" };
    } catch (reloadErr) {
      logger.error("Error while reloading updated work: " + reloadErr.message);
      return { success: true, data: work };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error in updateWorkService: " + error.message);
    throw error;
  }
};

// Phê duyệt công việc - xử lý sau
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

    // Notification for assigned user removed (field deprecated).

    return { success: true, data: work };
  } catch (error) {
    logger.error("Error in approveWorkService: " + error.message);
    throw error;
  }
};

/**
 * Hủy công việc - cập nhật status thành 'cancelled' mà không xóa bản ghi
 * Chỉ cho phép hủy nếu công việc đang ở trạng thái 'pending'
 * Đồng thời cập nhật trạng thái tất cả các assignment liên quan thành 'cancelled'
 */
export const cancelWorkService = async (id) => {
  try {
    const work = await db.Work.findByPk(id);
    if (!work) {
      throw new Error("Công việc không tồn tại");
    }

    // Kiểm tra trạng thái - chỉ cho hủy nếu ở trạng thái pending
    if (work.status !== "pending") {
      throw new Error(`Chỉ có thể hủy công việc ở trạng thái chờ xử lý`);
    }

    // Update work status to cancelled
    await work.update({
      status: "cancelled",
      updated_at: new Date(),
    });

    // Cập nhật trạng thái tất cả các assignment liên quan thành cancelled
    try {
      await db.WorkAssignment.update(
        {
          assigned_status: "cancelled",
          updated_at: new Date(),
        },
        {
          where: { work_id: id },
        }
      );
      logger.info(`Đã cập nhật trạng thái assignments cho công việc ${id} thành cancelled`);
    } catch (assignmentErr) {
      logger.error("Failed to update work assignments status: " + assignmentErr.message);
    }

    try {
      // System notification about work cancellation
      await createNotificationService({
        title: `Công việc "${work.title}" đã được huỷ`,
        message: `Công việc "${work.title}" đã được huỷ.`,
        type: "work_cancelled",
        related_work_id: work.id,
        priority: "high",
        broadcast: false,
        systemNotification: {
          title: `Công việc "${work.title}" đã được huỷ`,
          message: `Công việc "${work.title}" đã được huỷ trong hệ thống.`,
          broadcast: false,
        },
      });
      logger.info(`Đã tạo thông báo hệ thống huỷ công việc: ${work.id} - ${work.title}`);
    } catch (err) {
      logger.error("Lỗi trong quá trình tạo thông báo hệ thống huỷ công việc: " + err.message);
    }

    // Log work history
    try {
      await createWorkHistoryService({
        work_id: id,
        action: "cancelled",
        changed_by: work.created_by,
        notes: "Công việc bị hủy",
      });
    } catch (historyError) {
      throw new Error(historyError.message);
    }

    return { success: true, message: "Hủy công việc thành công" };
  } catch (error) {
    logger.error("Error in cancelWorkService: " + error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Xóa công việc - xóa bản ghi khỏi database
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
        changed_by: work.created_by,
        notes: "Công việc bị xóa khỏi hệ thống",
      });
    } catch (historyError) {
      logger.error("Failed to log work history for deletion: " + historyError.message);
    }

    // Xóa bản ghi công việc
    await work.destroy();

    return { success: true, message: "Xóa công việc thành công" };
  } catch (error) {
    logger.error("Error in deleteWorkService: " + error.message);
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
