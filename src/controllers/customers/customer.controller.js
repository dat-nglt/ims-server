import logger from '../../utils/logger.js';
import {
  getCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from '../../services/customers/customer.service.js';

export const getCustomersController = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20, sort } = req.query;
    const result = await getCustomersService({ search, status, page: parseInt(page), limit: parseInt(limit), sort });
    res.json({ status: 'success', data: result.data, message: 'Lấy danh sách khách hàng thành công' });
  } catch (error) {
    logger.error(`[${req.id}] Error in getCustomersController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getCustomerByIdService(id);
    res.json({ status: 'success', data: result.data, message: 'Lấy thông tin khách hàng thành công' });
  } catch (error) {
    logger.error(`[${req.id}] Error in getCustomerByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

export const createCustomerController = async (req, res) => {
  try {
    const result = await createCustomerService(req.body);
    res.status(201).json({ status: 'success', data: result.data, message: 'Tạo khách hàng thành công' });
  } catch (error) {
    logger.error(`[${req.id}] Error in createCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateCustomerService(id, req.body);
    res.json({ status: 'success', data: result.data, message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    logger.error(`[${req.id}] Error in updateCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomerService(id);
    res.json({ status: 'success', data: result, message: 'Xóa (soft) khách hàng thành công' });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};