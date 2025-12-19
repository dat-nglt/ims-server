import { Op } from 'sequelize';
import db from '../../models/index.js';
import logger from '../../utils/logger.js';

export const getCustomersService = async (filters) => {
  try {
    const { search, status, page = 1, limit = 20, sort } = filters;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (status && status !== 'all') where.status = status;

    const order = [];
    if (sort) {
      const [field, dir] = sort.split(':');
      order.push([field, dir || 'ASC']);
    }

    const offset = (page - 1) * limit;

    const result = await db.Customer.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [
        { model: db.User, as: 'account_manager', attributes: ['id', 'name'] },
      ],
      distinct: true,
    });

    return {
      success: true,
      data: {
        customers: result.rows,
        total: result.count,
        page,
        limit,
      },
    };
  } catch (error) {
    logger.error('Error in getCustomersService:' + error.message);
    throw error;
  }
};

export const getCustomerByIdService = async (id) => {
  const customer = await db.Customer.findByPk(id, {
    include: [{ model: db.Work, as: 'works', attributes: ['id', 'title', 'status', 'created_date'] }],
  });
  if (!customer) throw new Error('Customer not found');
  return { success: true, data: customer };
};

export const createCustomerService = async (payload) => {
  if (!payload.name) throw new Error('Thiếu thông tin bắt buộc: name');
  const customer = await db.Customer.create(payload);
  return { success: true, data: customer };
};

export const updateCustomerService = async (id, payload) => {
  const customer = await db.Customer.findByPk(id);
  if (!customer) throw new Error('Customer not found');
  await customer.update(payload);
  return { success: true, data: customer };
};

export const deleteCustomerService = async (id) => {
  const customer = await db.Customer.findByPk(id);
  if (!customer) throw new Error('Customer not found');
  // Soft delete: set inactive
  await customer.update({ status: 'inactive' });
  return { success: true };
};