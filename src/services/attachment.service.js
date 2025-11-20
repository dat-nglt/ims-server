import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả tập tin
 */
export const getAllAttachmentsService = async () => {
  try {
    const attachments = await db.Attachment.findAll({
      include: [
        { model: db.Work, as: "work" },
        { model: db.WorkReport, as: "report" },
        { model: db.User, as: "uploader" },
      ],
    });

    return { success: true, data: attachments };
  } catch (error) {
    logger.error("Error in getAllAttachmentsService:", error.message);
    throw error;
  }
};

/**
 * Lấy tập tin theo ID
 */
export const getAttachmentByIdService = async (id) => {
  try {
    const attachment = await db.Attachment.findByPk(id, {
      include: [
        { model: db.Work, as: "work" },
        { model: db.WorkReport, as: "report" },
        { model: db.User, as: "uploader" },
      ],
    });

    if (!attachment) {
      throw new Error("Tập tin không tồn tại");
    }

    return { success: true, data: attachment };
  } catch (error) {
    logger.error("Error in getAttachmentByIdService:", error.message);
    throw error;
  }
};

/**
 * Upload tập tin
 */
export const uploadAttachmentService = async (attachmentData) => {
  try {
    const {
      work_id,
      report_id,
      file_name,
      file_url,
      file_type,
      file_size,
      uploaded_by,
    } = attachmentData;

    if (!file_name || !file_url || !uploaded_by) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const attachment = await db.Attachment.create({
      work_id,
      report_id,
      file_name,
      file_url,
      file_type,
      file_size,
      uploaded_by,
      uploaded_at: new Date(),
    });

    return { success: true, data: attachment };
  } catch (error) {
    logger.error("Error in uploadAttachmentService:", error.message);
    throw error;
  }
};

/**
 * Xóa tập tin
 */
export const deleteAttachmentService = async (id) => {
  try {
    const attachment = await db.Attachment.findByPk(id);
    if (!attachment) {
      throw new Error("Tập tin không tồn tại");
    }

    await attachment.destroy();

    return { success: true, message: "Xóa tập tin thành công" };
  } catch (error) {
    logger.error("Error in deleteAttachmentService:", error.message);
    throw error;
  }
};

/**
 * Lấy tập tin theo work ID
 */
export const getAttachmentsByWorkIdService = async (workId) => {
  try {
    const attachments = await db.Attachment.findAll({
      where: { work_id: workId },
      include: [{ model: db.User, as: "uploader" }],
    });

    return { success: true, data: attachments };
  } catch (error) {
    logger.error("Error in getAttachmentsByWorkIdService:", error.message);
    throw error;
  }
};
