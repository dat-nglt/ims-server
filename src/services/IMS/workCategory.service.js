import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách tất cả danh mục công việc
 */
export const getAllWorkCategoriesService = async () => {
  try {
    const categories = await db.WorkCategory.findAll({
      where: { is_active: true },
      order: [["display_order", "ASC"]],
    });
    return { success: true, data: categories };
  } catch (error) {
    logger.error("Error in getAllWorkCategoriesService:", error.message);
    throw error;
  }
};

/**
 * Lấy danh mục công việc theo ID
 */
export const getWorkCategoryByIdService = async (id) => {
  try {
    const category = await db.WorkCategory.findByPk(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    return { success: true, data: category };
  } catch (error) {
    logger.error("Error in getWorkCategoryByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo danh mục công việc
 */
export const createWorkCategoryService = async (categoryData) => {
  try {
    const { name, description, icon, color, display_order } = categoryData;

    if (!name) {
      throw new Error("Tên danh mục là bắt buộc");
    }

    const category = await db.WorkCategory.create({
      name,
      description,
      icon,
      color,
      display_order,
      is_active: true,
    });

    return { success: true, data: category };
  } catch (error) {
    logger.error("Error in createWorkCategoryService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật danh mục công việc
 */
export const updateWorkCategoryService = async (id, updateData) => {
  try {
    const category = await db.WorkCategory.findByPk(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }

    const { description, icon, color, display_order, is_active } = updateData;

    await category.update({
      description,
      icon,
      color,
      display_order,
      is_active,
      updated_at: new Date(),
    });

    return { success: true, data: category };
  } catch (error) {
    logger.error("Error in updateWorkCategoryService:", error.message);
    throw error;
  }
};

/**
 * Xóa danh mục công việc
 */
export const deleteWorkCategoryService = async (id) => {
  try {
    const category = await db.WorkCategory.findByPk(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }

    await category.destroy();

    return { success: true, message: "Xóa danh mục công việc thành công" };
  } catch (error) {
    logger.error("Error in deleteWorkCategoryService:", error.message);
    throw error;
  }
};
