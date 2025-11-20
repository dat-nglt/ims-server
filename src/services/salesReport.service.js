import db from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * Lấy danh sách tất cả báo cáo
 */
export const getAllSalesReportsService = async () => {
  try {
    const reports = await db.SalesReportDaily.findAll({
      include: [{ model: db.User, as: "salesPerson" }],
      order: [["report_date", "DESC"]],
    });

    return { success: true, data: reports };
  } catch (error) {
    logger.error("Error in getAllSalesReportsService:", error.message);
    throw error;
  }
};

/**
 * Lấy báo cáo theo ID
 */
export const getSalesReportByIdService = async (id) => {
  try {
    const report = await db.SalesReportDaily.findByPk(id, {
      include: [{ model: db.User, as: "salesPerson" }],
    });

    if (!report) {
      throw new Error("Báo cáo bán hàng không tồn tại");
    }

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in getSalesReportByIdService:", error.message);
    throw error;
  }
};

/**
 * Tạo báo cáo
 */
export const createSalesReportService = async (reportData) => {
  try {
    const { report_code, sales_person_id, report_date, revenue, cost, notes } =
      reportData;

    if (!report_code || !sales_person_id || !report_date) {
      throw new Error("Thiếu thông tin bắt buộc");
    }

    const profit = revenue && cost ? revenue - cost : null;

    const report = await db.SalesReportDaily.create({
      report_code,
      sales_person_id,
      report_date,
      revenue,
      cost,
      profit,
      notes,
    });

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in createSalesReportService:", error.message);
    throw error;
  }
};

/**
 * Cập nhật báo cáo
 */
export const updateSalesReportService = async (id, updateData) => {
  try {
    const report = await db.SalesReportDaily.findByPk(id);
    if (!report) {
      throw new Error("Báo cáo bán hàng không tồn tại");
    }

    const { revenue, cost, notes } = updateData;
    const profit = revenue && cost ? revenue - cost : report.profit;

    await report.update({
      revenue,
      cost,
      profit,
      notes,
      updated_at: new Date(),
    });

    return { success: true, data: report };
  } catch (error) {
    logger.error("Error in updateSalesReportService:", error.message);
    throw error;
  }
};

/**
 * Lấy báo cáo theo khoảng thời gian
 */
export const getSalesReportsByDateRangeService = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      throw new Error("startDate và endDate là bắt buộc");
    }

    const reports = await db.SalesReportDaily.findAll({
      where: {
        report_date: {
          [db.sequelize.Sequelize.Op.between]: [
            new Date(startDate),
            new Date(endDate),
          ],
        },
      },
      include: [{ model: db.User, as: "salesPerson" }],
      order: [["report_date", "DESC"]],
    });

    return { success: true, data: reports };
  } catch (error) {
    logger.error(
      "Error in getSalesReportsByDateRangeService:",
      error.message
    );
    throw error;
  }
};
