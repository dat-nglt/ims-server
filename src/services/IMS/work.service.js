import db from "../../models/index.js";
import logger from "../../utils/logger.js";

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
      created_by_sales_id,
      priority,
      due_date,
      location,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
    } = workData;

    if (!work_code || !title || !assigned_user_id) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    // Kiểm tra work_code đã tồn tại
    const existingWork = await db.Work.findOne({ where: { work_code } });
    if (existingWork) {
      throw new Error("Mã công việc đã tồn tại");
    }

    const work = await db.Work.create({
      work_code,
      title,
      description,
      category_id,
      assigned_user_id,
      created_by_sales_id,
      priority,
      status: "pending",
      due_date,
      location,
      customer_name,
      customer_phone,
      customer_address,
      location_lat,
      location_lng,
      estimated_hours,
      estimated_cost,
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
