import logger from "../../utils/logger.js";
import * as technicianSkillService from "../../services/hr/index.js";

/**
 * Lấy danh sách tất cả cấp bậc
 */
export const getAllTechnicianSkillsController = async (req, res) => {
  try {
    const result = await technicianSkillService.getAllTechnicianSkillsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách cấp bậc kỹ thuật viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllTechnicianSkillsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy cấp bậc theo technician ID
 */
export const getTechnicianSkillByTechnicianIdController = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const result = await technicianSkillService.getTechnicianSkillByTechnicianIdService(technicianId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy cấp bậc kỹ thuật viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getTechnicianSkillByTechnicianIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Phân công cấp bậc
 */
export const assignTechnicianSkillController = async (req, res) => {
  try {
    const result = await technicianSkillService.assignTechnicianSkillService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Phân công cấp bậc kỹ thuật viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in assignTechnicianSkillController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cập nhật cấp bậc
 */
export const updateTechnicianSkillController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await technicianSkillService.updateTechnicianSkillService(id, req.body);
    res.json({
      status: "success",
      data: result.data,
      message: "Cập nhật cấp bậc kỹ thuật viên thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in updateTechnicianSkillController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa cấp bậc
 */
export const deleteTechnicianSkillController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await technicianSkillService.deleteTechnicianSkillService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteTechnicianSkillController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};
