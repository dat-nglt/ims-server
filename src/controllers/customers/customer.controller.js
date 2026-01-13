import logger from "../../utils/logger.js";
import * as customerService from "../../services/customers/customer.service.js";

export const getCustomersController = async (req, res) => {
  try {
    const result = await customerService.getCustomersService();
    res.json(result);
  } catch (error) {
    logger.error(`[${req.id}] Error in getCustomersController:`, error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.getCustomerByIdService(id);
    res.json({ status: "success", data: result.data, message: "Lấy thông tin khách hàng thành công" });
  } catch (error) {
    logger.error(`[${req.id}] Error in getCustomerByIdController:`, error.message);
    res.status(404).json({ error: error.message });
  }
};

export const createCustomerController = async (req, res) => {
  try {
    const result = await customerService.createCustomerService(req.body);
    res.status(201).json({ status: "success", data: result.data, message: "Tạo khách hàng thành công" });
  } catch (error) {
    logger.error(`[${req.id}] Error in createCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.updateCustomerService(id, req.body);
    res.json({ status: "success", data: result.data, message: "Cập nhật khách hàng thành công" });
  } catch (error) {
    logger.error(`[${req.id}] Error in updateCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.deleteCustomerService(id);
    res.json({ status: "success", data: result, message: "Xóa (soft) khách hàng thành công" });
  } catch (error) {
    logger.error(`[${req.id}] Error in deleteCustomerController:`, error.message);
    res.status(400).json({ error: error.message });
  }
};
