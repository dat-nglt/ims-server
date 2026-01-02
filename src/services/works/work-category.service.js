import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Lấy danh sách danh mục công việc
 */
export const getAllWorkCategoriesService = async () => {
  try {
    const categories = await db.WorkCategory.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    logger.error("Error in getAllWorkCategoriesService:" + error.message);
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
    logger.error("Error in getWorkCategoryByIdService:" + error.message);
    throw error;
  }
};

/**
 * Tạo danh mục công việc
 */
export const createWorkCategoryService = async (categoryData) => {
  try {
    const { name, description } = categoryData;

    if (!name || !name.trim()) {
      throw new Error("Tên danh mục không được để trống");
    }

    const trimmedName = name.trim();
    const normalized = trimmedName.toLowerCase();

    // Find existing category by case-insensitive name match
    const existingCategory = await db.WorkCategory.findOne({
      where: db.Sequelize.where(db.Sequelize.fn("LOWER", db.Sequelize.col("name")), normalized),
    });

    if (existingCategory) {
      if (existingCategory.is_active) {
        throw new Error("Danh mục với tên này đã tồn tại");
      }

      // Reactivate and update description/name if provided
      await existingCategory.update({
        name: trimmedName,
        description: description ? description.trim() : existingCategory.description,
        is_active: true,
        updated_at: new Date(),
      });

      return {
        success: true,
        data: existingCategory,
        message: "Tạo danh mục công việc thành công (đã kích hoạt lại)",
      };
    }

    const category = await db.WorkCategory.create({
      name: trimmedName,
      description: description ? description.trim() : "",
      is_active: true,
    });

    return { success: true, data: category, message: "Tạo danh mục công việc thành công" };
  } catch (error) {
    // Handle unique constraint error more gracefully
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.error("Unique constraint in createWorkCategoryService:" + error.message);
      return { success: false, data: null, message: "Danh mục với tên này đã tồn tại" };
    }

    logger.error("Error in createWorkCategoryService:" + error.message);
    return { success: false, data: null, message: error.message };
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

    const { name, description, is_active } = updateData;

    // If name provided, validate not empty and check case-insensitive duplicates
    if (name !== undefined) {
      if (!name || !name.trim()) {
        throw new Error("Tên danh mục không được để trống");
      }

      const trimmedName = name.trim();
      const normalized = trimmedName.toLowerCase();

      const existing = await db.WorkCategory.findOne({
        where: db.Sequelize.where(db.Sequelize.fn("LOWER", db.Sequelize.col("name")), normalized),
      });

      if (existing && existing.id !== category.id && existing.is_active) {
        throw new Error("Danh mục với tên này đã tồn tại");
      }
    }

    // If activating the category, ensure another active category with same name doesn't exist
    if (is_active === true) {
      const checkName = (name !== undefined ? name.trim() : category.name).toLowerCase();
      const existingActive = await db.WorkCategory.findOne({
        where: db.Sequelize.and(db.Sequelize.where(db.Sequelize.fn("LOWER", db.Sequelize.col("name")), checkName), {
          is_active: true,
        }),
      });

      if (existingActive && existingActive.id !== category.id) {
        throw new Error("Không thể kích hoạt vì đã tồn tại danh mục khác cùng tên");
      }
    }

    const updated = await category.update({
      name: name !== undefined ? name.trim() : category.name,
      description: description !== undefined ? description : category.description,
      is_active: is_active !== undefined ? is_active : category.is_active,
      updated_at: new Date(),
    });

    return { success: true, data: updated, message: "Cập nhật danh mục công việc thành công" };
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.error("Unique constraint in updateWorkCategoryService:" + error.message);
      throw new Error("Danh mục với tên này đã tồn tại");
    }

    logger.error("Error in updateWorkCategoryService:" + error.message);
    throw error;
  }
};

/**
 * Xóa danh mục công việc (soft delete)
 */
export const deleteWorkCategoryService = async (id) => {
  try {
    const category = await db.WorkCategory.findByPk(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }

    // Check if category has associated works
    const workCount = await db.Work.count({ where: { category_id: id } });
    if (workCount > 0) {
      throw new Error("Không thể xóa danh mục đang có công việc liên quan");
    }

    await category.update({
      is_active: false,
      updated_at: new Date(),
    });

    return {
      success: true,
      message: "Xóa danh mục công việc thành công",
    };
  } catch (error) {
    logger.error("Error in deleteWorkCategoryService:" + error.message);
    throw error;
  }
};
