import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Lấy danh sách danh mục công việc với pagination và search
 */
export const getAllWorkCategoriesService = async (queryParams = {}) => {
    try {
        const { page = 1, limit = 20, search, is_active } = queryParams;

        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }
        if (is_active !== undefined) {
            where.is_active = is_active === "true";
        } else {
            where.is_active = true; // Default to active only
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await db.WorkCategory.findAndCountAll({
            where,
            order: [
                ["display_order", "ASC"],
                ["created_at", "DESC"],
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalPages = Math.ceil(count / limit);

        return {
            success: true,
            data: {
                categories: rows,
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
            },
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
        const { name, description, icon, color, display_order } = categoryData;

        if (!name || !["Công trình", "Dịch vụ"].includes(name)) {
            throw new Error("Tên danh mục phải là 'Công trình' hoặc 'Dịch vụ'");
        }

        // Check if name already exists for active categories   
        const existingCategory = await db.WorkCategory.findOne({
            where: { name, is_active: true },
        });
        if (existingCategory) {
            throw new Error("Danh mục với tên này đã tồn tại");
        }

        const category = await db.WorkCategory.create({
            name,
            description: description || "",
            icon: icon || "",
            color: color || "#000000",
            display_order: display_order || 0,
            is_active: true,
        });

        return { success: true, data: category };
    } catch (error) {
        logger.error("Error in createWorkCategoryService:" + error.message);
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

        const { description, icon, color, display_order, is_active } =
            updateData;

        // Validate display_order if provided
        if (
            display_order !== undefined &&
            (display_order < 0 || display_order > 999)
        ) {
            throw new Error("Thứ tự hiển thị phải từ 0 đến 999");
        }

        await category.update({
            description:
                description !== undefined ? description : category.description,
            icon: icon !== undefined ? icon : category.icon,
            color: color !== undefined ? color : category.color,
            display_order:
                display_order !== undefined
                    ? display_order
                    : category.display_order,
            is_active: is_active !== undefined ? is_active : category.is_active,
            updated_at: new Date(),
        });

        return { success: true, data: category };
    } catch (error) {
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
            throw new Error(
                "Không thể xóa danh mục đang có công việc liên quan"
            );
        }

        await category.update({
            is_active: false,
            updated_at: new Date(),
        });

        return {
            success: true,
            message: "Xóa danh mục công việc thành công (soft delete)",
        };
    } catch (error) {
        logger.error("Error in deleteWorkCategoryService:" + error.message);
        throw error;
    }
};
