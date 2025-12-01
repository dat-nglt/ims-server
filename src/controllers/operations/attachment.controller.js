import logger from "../../utils/logger.js";
import * as attachmentService from "../../services/operations/index.js";

/**
 * Lấy danh sách tất cả tập tin
 */
export const getAllAttachmentsController = async (req, res) => {
  try {
    const result = await attachmentService.getAllAttachmentsService();
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy danh sách tập tin đính kèm thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAllAttachmentsController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy tập tin theo ID
 */
export const getAttachmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attachmentService.getAttachmentByIdService(id);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy thông tin tập tin thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAttachmentByIdController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Upload tập tin
 */
export const uploadAttachmentController = async (req, res) => {
  try {
    const result = await attachmentService.uploadAttachmentService(req.body);
    res.status(201).json({
      status: "success",
      data: result.data,
      message: "Upload tập tin thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in uploadAttachmentController:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

/**
 * Xóa tập tin
 */
export const deleteAttachmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attachmentService.deleteAttachmentService(id);
    res.json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in deleteAttachmentController:`,
      error.message
    );
    res.status(404).json({ error: error.message });
  }
};

/**
 * Lấy tập tin theo work ID
 */
export const getAttachmentsByWorkIdController = async (req, res) => {
  try {
    const { workId } = req.params;
    const result = await attachmentService.getAttachmentsByWorkIdService(workId);
    res.json({
      status: "success",
      data: result.data,
      message: "Lấy tập tin đính kèm thành công",
    });
  } catch (error) {
    logger.error(
      `[${req.id}] Error in getAttachmentsByWorkIdController:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
