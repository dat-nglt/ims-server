import { Op } from "sequelize";
import db from "../../models/index.js"; // Updated to use centralized db
import logger from "../../utils/logger.js"; // Added for consistent logging
import { createNotificationService } from "../operations/notification.service.js";
import { createProjectHistoryService } from "./project-history.service.js";

// Helper to format dates to YYYY-MM-DD for frontend consistency
const formatDateDMY = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;

  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = dt.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getProjectsService = async (query = {}) => {
  try {
    if (query.fields) {
      const fieldArray = query.fields.split(",").map((f) => f.trim());
      const projects = await db.Project.findAll({
        attributes: fieldArray,
        order: [["name", "ASC"]],
      });

      return {
        success: true,
        data: projects,
      };
    }

    // Fetch all projects without filters or pagination
    const queryOptions = {
      include: [
        { model: db.User, as: "manager", attributes: ["name"] },
        {
          model: db.User,
          as: "team",
          attributes: ["name"],
          through: { attributes: [] },
        }, // Many-to-many for team
        {
          model: db.ProjectTeamMember,
          as: "teamMembers",
          attributes: ["id", "user_id", "name", "role", "days_worked", "allocation_percent"],
        },
        { model: db.Work, as: "works", attributes: [] }, // For counting tasks
        { model: db.WorkReport, as: "reports", attributes: [] }, // For pending reports
      ],
      attributes: [
        "id",
        "name",
        "status",
        "priority",
        "progress",
        "start_date",
        "end_date",
        "budget",
        "spent",
        "total_tasks",
        "completed_tasks",
        "overdue_tasks",
        "pending_reports", // Use stored fields or compute below
      ],
      distinct: true, // For accurate count with includes
    };

    // No pagination: return all projects

    const projects = await db.Project.findAndCountAll(queryOptions);

    // Transform to camelCase and compute fields if not stored
    const transformedProjects = projects.rows.map((project) => {
      const data = project.toJSON();
      // Compute if not stored (e.g., from works)
      if (!data.total_tasks) data.total_tasks = data.works ? data.works.length : 0;
      if (!data.completed_tasks)
        data.completed_tasks = data.works ? data.works.filter((w) => w.status === "completed").length : 0;
      if (!data.overdue_tasks)
        data.overdue_tasks = data.works ? data.works.filter((w) => w.status === "overdue").length : 0;
      if (!data.pending_reports)
        data.pending_reports = data.reports ? data.reports.filter((r) => r.status === "pending").length : 0;

      return {
        id: data.id,
        name: data.name,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        startDate: formatDateDMY(data.start_date),
        endDate: formatDateDMY(data.end_date),
        manager: data.manager ? data.manager.name : "",
        team: data.team ? data.team.map((u) => u.name) : [],
        teamMembers: data.teamMembers
          ? data.teamMembers.map((m) => ({
              id: m.id,
              userId: m.user_id,
              name: m.name,
              role: m.role,
              daysWorked: m.days_worked,
              allocation: m.allocation_percent,
            }))
          : [],
        totalTasks: data.total_tasks,
        completedTasks: data.completed_tasks,
        overdueTasks: data.overdue_tasks,
        pendingReports: data.pending_reports,
        plannedManpower: data.planned_manpower || 0,
        consumedManpower: data.consumed_manpower || 0,
        timeline: data.timeline || [],
        budgetDetails: data.budget_details || [],
        budget: data.budget,
        spent: data.spent,
      };
    });

    return {
      success: true,
      data: {
        projects: transformedProjects,
        total: projects.count,
      },
    };
  } catch (error) {
    logger.error("Error in getProjectsService:" + error.message);
    throw error;
  }
};

// Get statistics
export const getStatisticsService = async () => {
  try {
    const projects = await db.Project.findAll({
      include: [{ model: db.Work, as: "works", attributes: [] }],
      attributes: ["status", "budget", "spent"],
    });

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "active" || p.status === "in_progress").length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const delayedProjects = projects.filter((p) => p.status === "on_hold" || p.status === "cancelled").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const totalTasks = projects.reduce((sum, p) => sum + (p.works ? p.works.length : 0), 0);
    const completedTasks = projects.reduce(
      (sum, p) => sum + (p.works ? p.works.filter((w) => w.status === "completed").length : 0),
      0
    );

    return {
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        delayedProjects,
        totalBudget,
        totalSpent,
        totalTasks,
        completedTasks,
      },
    };
  } catch (error) {
    logger.error("Error in getStatisticsService:" + error.message);
    throw error;
  }
};

export const getProjectsCategoryForWorkService = async () => {
  try {
    const projectsCategoryForWork = await db.Project.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    return {
      success: true,
      data: projectsCategoryForWork,
      message: "Lấy danh mục dự án cho công việc thành công",
    };
  } catch (error) {
    logger.error("Error in getProjectsCategoryForWorkService:" + error.message);
    return {
      success: false,
      data: null,
      message: "Lấy danh mục dự án cho công việc thất bại",
    };
  }
};

// Get distribution
export const getDistributionService = async () => {
  try {
    const projects = await db.Project.findAll({
      include: [{ model: db.Work, as: "works", attributes: ["status"] }],
      attributes: ["status"],
    });

    // Status distribution
    const statusCounts = {};
    projects.forEach((p) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    const totalProjects = projects.length;
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
    }));

    // Task distribution
    const taskCounts = {};
    projects.forEach((p) => {
      p.works.forEach((w) => {
        taskCounts[w.status] = (taskCounts[w.status] || 0) + 1;
      });
    });
    const taskDistribution = Object.entries(taskCounts).map(([status, count]) => ({ status, count }));

    return {
      success: true,
      data: { statusDistribution, taskDistribution },
    };
  } catch (error) {
    logger.error("Error in getDistributionService:" + error.message);
    throw error;
  }
};

// Create project
export const createProjectService = async (data) => {
  try {
    const { name, manager_id } = data;
    if (!name) {
      throw new Error("Thiếu thông tin bắt buộc: name");
    }
    // Validate manager_id exists
    if (manager_id) {
      const manager = await db.User.findByPk(manager_id);
      if (!manager) {
        throw new Error("Người quản lý không tồn tại");
      }
    }

    const transaction = await db.sequelize.transaction();
    try {
      const project = await db.Project.create(data, { transaction });
      await transaction.commit();

      // Log project history
      try {
        await createProjectHistoryService({
          project_id: project.id,
          action: "created",
          changed_by: manager_id || data.created_by, // Use manager_id or provided created_by
          notes: "Dự án được tạo",
        });
      } catch (historyError) {
        logger.error("Failed to log project history for creation: " + historyError.message);
      }

      // Create notification for project manager if assigned
      if (manager_id) {
        try {
          await createNotificationService({
            title: "Dự án mới được giao quản lý",
            message: `Dự án "${name}" đã được tạo và bạn được chỉ định làm quản lý.`,
            type: "project_assigned",
            related_project_id: project.id,
            action_url: `/projects/${project.id}`,
            recipients: [manager_id],
          });
        } catch (notificationError) {
          logger.error("Failed to create notification for project creation: " + notificationError.message);
        }
      }

      return { success: true, data: project };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error("Error in createProjectService:" + error.message);
    throw error;
  }
};

// Update project
export const updateProjectService = async (id, data) => {
  try {
    // Get current project to know the manager
    const currentProject = await db.Project.findByPk(id);
    if (!currentProject) {
      throw new Error("Dự án không tồn tại");
    }

    // Kiểm tra manager_id nếu được cung cấp
    if (data.manager_id) {
      const manager = await db.User.findByPk(data.manager_id);
      if (!manager) {
        throw new Error("Người quản lý không tồn tại");
      }
    }

    const transaction = await db.sequelize.transaction();
    try {
      const [updated] = await db.Project.update(data, {
        where: { id },
        transaction,
      });
      if (updated) {
        const project = await db.Project.findByPk(id, { transaction });
        await transaction.commit();

        // Log project history
        try {
          await createProjectHistoryService({
            project_id: id,
            action: "updated",
            changed_by: data.changed_by || managerId, // Use provided or current manager
            notes: "Dự án được cập nhật",
          });
        } catch (historyError) {
          logger.error("Failed to log project history for update: " + historyError.message);
        }

        // Create notification for project manager
        const managerId = data.manager_id || currentProject.manager_id;
        if (managerId) {
          try {
            await createNotificationService({
              title: "Dự án được cập nhật",
              message: `Dự án "${project.name}" đã được cập nhật.`,
              type: "project_updated",
              related_project_id: id,
              action_url: `/projects/${id}`,
              recipients: [managerId],
            });
          } catch (notificationError) {
            logger.error("Failed to create notification for project update: " + notificationError.message);
          }
        }

        return { success: true, data: project };
      }
      throw new Error("Dự án không tồn tại");
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error("Error in updateProjectService:" + error.message);
    throw error;
  }
};

// Delete project
export const deleteProjectService = async (id) => {
  try {
    // Get project before deletion to know the manager
    const project = await db.Project.findByPk(id);
    if (!project) {
      throw new Error("Dự án không tồn tại");
    }

    const transaction = await db.sequelize.transaction();
    try {
      // Log project history before deletion
      try {
        await createProjectHistoryService({
          project_id: id,
          action: "deleted",
          changed_by: project.manager_id || data.changed_by, // Use manager or provided
          notes: "Dự án bị xóa",
        });
      } catch (historyError) {
        logger.error("Failed to log project history for deletion: " + historyError.message);
      }

      // Create notification for project manager before deletion
      if (project.manager_id) {
        try {
          await createNotificationService({
            title: "Dự án bị xóa",
            message: `Dự án "${project.name}" đã bị xóa khỏi hệ thống.`,
            type: "project_deleted",
            related_project_id: id,
            action_url: `/projects`, // Redirect to projects list
            recipients: [project.manager_id],
          });
        } catch (notificationError) {
          logger.error("Failed to create notification for project deletion: " + notificationError.message);
        }
      }

      const deleted = await db.Project.destroy({
        where: { id },
        transaction,
      });
      await transaction.commit();
      if (deleted > 0) {
        return {
          success: true,
          message: "Xoá dự án thành công",
        };
      }
      throw new Error("Dự án không tồn tại");
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error("Error in deleteProjectService:" + error.message);
    throw error;
  }
};
