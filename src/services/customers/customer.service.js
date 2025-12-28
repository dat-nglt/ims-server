import { Op } from "sequelize";
import db from "../../models/index.js";
import logger from "../../utils/logger.js";

export const getCustomersService = async (filters = {}) => {
  try {
    // Lấy toàn bộ danh sách khách hàng có trong hệ thống (không có bộ lọc)
    const result = await db.Customer.findAll({
      order: [["created_at", "DESC"]],
      include: [{ model: db.User, as: "account_manager", attributes: ["id", "name"] }],
      attributes: {
        exclude: ["password"],
      },
    });

    return {
      success: true,
      data: result,
      message: "Lấy danh sách khách hàng thành công",
    };
  } catch (error) {
    logger.error("Error in getCustomersService:" + error.message);
    throw error;
  }
};

export const getCustomerByIdService = async (id) => {
  try {
    // Validate input
    if (!id || isNaN(id)) {
      throw new Error("Invalid customer ID provided");
    }

    const customer = await db.Customer.findByPk(id, {
      include: [
        {
          model: db.Work,
          as: "works",
          attributes: [
            "id",
            "work_code",
            "title",
            "status",
            "priority",
            "created_at",
            "estimated_cost",
            "actual_cost",
            "description",
          ],
          required: false, // LEFT JOIN - lấy customer dù không có works
          order: [["created_at", "DESC"]], // Sắp xếp works mới nhất trước
        },
        {
          model: db.User,
          as: "account_manager",
          attributes: ["id", "name", "email", "phone"],
          required: false, // LEFT JOIN
        },
      ],
    });

    if (!customer) {
      const error = new Error(`Customer with ID ${id} not found`);
      logger.warn(`Customer not found: ${id}`);
      throw error;
    }

    logger.info(`Retrieved customer details: ID ${id}, Name: ${customer.name}`);
    return { success: true, data: customer };
  } catch (error) {
    logger.error(`Error in getCustomerByIdService (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const createCustomerService = async (payload) => {
  try {
    // Validation
    if (!payload.name || !payload.name.trim()) {
      throw new Error("Thiếu thông tin bắt buộc: name");
    }

    // Sanitize payload
    const sanitizedPayload = {
      ...payload,
      name: payload.name.trim(),
      phone: payload.phone?.trim() || null,
      email: payload.email?.trim() || null,
    };

    const customer = await db.Customer.create(sanitizedPayload);
    logger.info(`Created customer: ID ${customer.id}, Name: ${customer.name}`);

    return { success: true, data: customer, message: "Tạo khách hàng thành công" };
  } catch (error) {
    logger.error(`Error in createCustomerService: ${error.message}`);
    throw error;
  }
};

export const updateCustomerService = async (id, payload) => {
  try {
    // Validate ID
    if (!id || isNaN(id)) {
      throw new Error("Invalid customer ID provided");
    }

    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    // Sanitize payload
    const sanitizedPayload = {
      ...payload,
      name: payload.name?.trim() || customer.name,
      phone: payload.phone?.trim() || customer.phone,
      email: payload.email?.trim() || customer.email,
    };

    await customer.update(sanitizedPayload);
    logger.info(`Updated customer: ID ${id}, Name: ${customer.name}`);

    return { success: true, data: customer, message: "Cập nhật khách hàng thành công" };
  } catch (error) {
    logger.error(`Error in updateCustomerService (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const deleteCustomerService = async (id) => {
  try {
    // Validate ID
    if (!id || isNaN(id)) {
      throw new Error("Invalid customer ID provided");
    }

    const customer = await db.Customer.findByPk(id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    // Soft delete: set inactive instead of hard delete
    await customer.update({ status: "inactive" });
    logger.info(`Deleted customer (soft delete): ID ${id}, Name: ${customer.name}`);

    return { success: true, message: "Xóa khách hàng thành công" };
  } catch (error) {
    logger.error(`Error in deleteCustomerService (ID: ${id}): ${error.message}`);
    throw error;
  }
};
