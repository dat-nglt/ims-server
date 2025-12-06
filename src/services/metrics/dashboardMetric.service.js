import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy danh sách thống kê dashboard
 */
export const getAllDashboardMetricsService = async () => {
  try {
    // Tính toán thống kê dự án
    const projectStats = await db.Project.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'active' THEN 1 END")), 'active'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Tính toán thống kê công việc
    const workStats = await db.Work.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'pending' THEN 1 END")), 'pending'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status IN ('assigned', 'in_progress') THEN 1 END")), 'in_progress'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Báo cáo gần đây
    const recentReports = await db.WorkReport.findAll({
      limit: 5,
      order: [['reported_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
        { model: db.User, as: 'reporter', attributes: ['id', 'name'] },
        { model: db.Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    // Lịch sử thay đổi gần đây
    const recentHistory = await db.WorkHistory.findAll({
      limit: 5,
      order: [['changed_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
        { model: db.User, as: 'changedByUser', attributes: ['id', 'name'] },
      ],
    });

    // Thống kê chấm công hôm nay
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = await db.CheckIn.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      where: db.sequelize.where(
        db.sequelize.fn('DATE', db.sequelize.col('check_in_time')),
        '=',
        today
      ),
      group: ['status'],
      raw: true,
    });

    // Map attendance status
    const attendanceMap = {
      'checked_in': 'present',
      'checked_out': 'present',
      'on_leave': 'absent',
    };

    const attendanceStats = attendanceToday.reduce((acc, item) => {
      const mappedStatus = attendanceMap[item.status] || 'absent';
      acc[mappedStatus] = (acc[mappedStatus] || 0) + parseInt(item.count);
      return acc;
    }, { present: 0, absent: 0 });

    const metrics = {
      projects: {
        total: parseInt(projectStats[0].total) || 0,
        active: parseInt(projectStats[0].active) || 0,
        completed: parseInt(projectStats[0].completed) || 0,
      },
      works: {
        total: parseInt(workStats[0].total) || 0,
        pending: parseInt(workStats[0].pending) || 0,
        in_progress: parseInt(workStats[0].in_progress) || 0,
        completed: parseInt(workStats[0].completed) || 0,
      },
      reports: recentReports,
      history: recentHistory,
      attendance: attendanceStats,
      date: today,
    };

    return { success: true, data: metrics };
  } catch (error) {
    logger.error("Error in getAllDashboardMetricsService:" + error.message);
    throw error;
  }
};

/**
 * Lấy thống kê cho user
 */
export const getDashboardMetricsByUserIdService = async (userId) => {
  try {
    // Tính toán thống kê dự án do user quản lý
    const projectStats = await db.Project.findAll({
      where: { manager_id: userId },
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'active' THEN 1 END")), 'active'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Tính toán thống kê công việc được giao cho user
    const workStats = await db.Work.findAll({
      where: { assigned_user_id: userId },
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'pending' THEN 1 END")), 'pending'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status IN ('assigned', 'in_progress') THEN 1 END")), 'in_progress'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Báo cáo gần đây của user
    const recentReports = await db.WorkReport.findAll({
      where: { reported_by: userId },
      limit: 5,
      order: [['reported_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
        { model: db.Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    // Lịch sử thay đổi gần đây của user
    const recentHistory = await db.WorkHistory.findAll({
      where: { changed_by: userId },
      limit: 5,
      order: [['changed_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
      ],
    });

    // Thống kê chấm công hôm nay của user
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = await db.CheckIn.findAll({
      where: {
        user_id: userId,
        [db.sequelize.Op.and]: db.sequelize.where(
          db.sequelize.fn('DATE', db.sequelize.col('check_in_time')),
          '=',
          today
        ),
      },
      attributes: ['status'],
      raw: true,
    });

    // Map attendance status
    const attendanceMap = {
      'checked_in': 'present',
      'checked_out': 'present',
      'on_leave': 'absent',
    };

    const attendanceStats = attendanceToday.reduce((acc, item) => {
      const mappedStatus = attendanceMap[item.status] || 'absent';
      acc[mappedStatus] = (acc[mappedStatus] || 0) + 1;
      return acc;
    }, { present: 0, absent: 0 });

    const metrics = {
      projects: {
        total: parseInt(projectStats[0].total) || 0,
        active: parseInt(projectStats[0].active) || 0,
        completed: parseInt(projectStats[0].completed) || 0,
      },
      works: {
        total: parseInt(workStats[0].total) || 0,
        pending: parseInt(workStats[0].pending) || 0,
        in_progress: parseInt(workStats[0].in_progress) || 0,
        completed: parseInt(workStats[0].completed) || 0,
      },
      reports: recentReports,
      history: recentHistory,
      attendance: attendanceStats,
      date: today,
      user_id: userId,
    };

    return { success: true, data: metrics };
  } catch (error) {
    logger.error(
      "Error in getDashboardMetricsByUserIdService:",
      error.message
    );
    throw error;
  }
};

/**
 * Lấy thống kê theo ngày
 */
export const getDashboardMetricsByDateService = async (date) => {
  try {
    // Tính toán thống kê dự án (không filter date vì projects không có date field phù hợp, có lẽ created_at)
    const projectStats = await db.Project.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'active' THEN 1 END")), 'active'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Tính toán thống kê công việc (không filter date)
    const workStats = await db.Work.findAll({
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'pending' THEN 1 END")), 'pending'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status IN ('assigned', 'in_progress') THEN 1 END")), 'in_progress'],
        [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN status = 'completed' THEN 1 END")), 'completed'],
      ],
      raw: true,
    });

    // Báo cáo theo ngày
    const recentReports = await db.WorkReport.findAll({
      where: db.sequelize.where(
        db.sequelize.fn('DATE', db.sequelize.col('reported_at')),
        '=',
        date
      ),
      limit: 5,
      order: [['reported_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
        { model: db.User, as: 'reporter', attributes: ['id', 'name'] },
        { model: db.Project, as: 'project', attributes: ['id', 'name'] },
      ],
    });

    // Lịch sử thay đổi theo ngày
    const recentHistory = await db.WorkHistory.findAll({
      where: db.sequelize.where(
        db.sequelize.fn('DATE', db.sequelize.col('changed_at')),
        '=',
        date
      ),
      limit: 5,
      order: [['changed_at', 'DESC']],
      include: [
        { model: db.Work, as: 'work', attributes: ['id', 'title'] },
        { model: db.User, as: 'changedByUser', attributes: ['id', 'name'] },
      ],
    });

    // Thống kê chấm công theo ngày
    const attendanceStatsRaw = await db.CheckIn.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      where: db.sequelize.where(
        db.sequelize.fn('DATE', db.sequelize.col('check_in_time')),
        '=',
        date
      ),
      group: ['status'],
      raw: true,
    });

    // Map attendance status
    const attendanceMap = {
      'checked_in': 'present',
      'checked_out': 'present',
      'on_leave': 'absent',
    };

    const attendanceStats = attendanceStatsRaw.reduce((acc, item) => {
      const mappedStatus = attendanceMap[item.status] || 'absent';
      acc[mappedStatus] = (acc[mappedStatus] || 0) + parseInt(item.count);
      return acc;
    }, { present: 0, absent: 0 });

    const metrics = {
      projects: {
        total: parseInt(projectStats[0].total) || 0,
        active: parseInt(projectStats[0].active) || 0,
        completed: parseInt(projectStats[0].completed) || 0,
      },
      works: {
        total: parseInt(workStats[0].total) || 0,
        pending: parseInt(workStats[0].pending) || 0,
        in_progress: parseInt(workStats[0].in_progress) || 0,
        completed: parseInt(workStats[0].completed) || 0,
      },
      reports: recentReports,
      history: recentHistory,
      attendance: attendanceStats,
      date: date,
    };

    return { success: true, data: metrics };
  } catch (error) {
    logger.error("Error in getDashboardMetricsByDateService:" + error.message);
    throw error;
  }
};
