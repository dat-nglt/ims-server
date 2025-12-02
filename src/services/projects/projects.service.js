import { Op } from "sequelize";
import db from "../../models/index.js"; // Updated to use centralized db
import logger from "../../utils/logger.js"; // Added for consistent logging

// Fetch projects with filters, includes, and computed fields
export const getProjectsService = async (filters) => {
    try {
        const { search, status, priority, sort, page, limit } = filters;
        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { "$manager.name$": { [Op.iLike]: `%${search}%` } }, // Search in manager name
            ];
        }
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const order = [];
        if (sort) {
            const [field, direction] = sort.split(":");
            order.push([field, direction || "ASC"]);
        }

        const offset = (page - 1) * limit;

        const projects = await db.Project.findAndCountAll({
            where,
            include: [
                { model: db.User, as: "manager", attributes: ["name"] },
                {
                    model: db.User,
                    as: "team",
                    attributes: ["name"],
                    through: { attributes: [] },
                }, // Many-to-many for team
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
                "totalTasks",
                "completedTasks",
                "overdueTasks",
                "pendingReports", // Use stored fields or compute below
            ],
            limit,
            offset,
            order,
            distinct: true, // For accurate count with includes
        });

        // Transform to camelCase and compute fields if not stored
        const transformedProjects = projects.rows.map((project) => {
            const data = project.toJSON();
            // Compute if not stored (e.g., from works)
            if (!data.totalTasks)
                data.totalTasks = data.works ? data.works.length : 0;
            if (!data.completedTasks)
                data.completedTasks = data.works
                    ? data.works.filter((w) => w.status === "completed").length
                    : 0;
            if (!data.overdueTasks)
                data.overdueTasks = data.works
                    ? data.works.filter((w) => w.status === "overdue").length
                    : 0;
            if (!data.pendingReports)
                data.pendingReports = data.reports
                    ? data.reports.filter((r) => r.status === "pending").length
                    : 0;

            return {
                id: data.id,
                name: data.name,
                status: data.status,
                priority: data.priority,
                progress: data.progress,
                startDate: data.start_date,
                endDate: data.end_date,
                manager: data.manager ? data.manager.name : "",
                team: data.team ? data.team.map((u) => u.name) : [],
                totalTasks: data.totalTasks,
                completedTasks: data.completedTasks,
                overdueTasks: data.overdueTasks,
                pendingReports: data.pendingReports,
                budget: data.budget,
                spent: data.spent,
            };
        });

        return {
            success: true,
            data: {
                projects: transformedProjects,
                total: projects.count,
                page,
                limit,
            },
        };
    } catch (error) {
        logger.error("Error in getProjectsService:", error.message);
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
        const activeProjects = projects.filter(
            (p) => p.status === "active" || p.status === "in_progress"
        ).length;
        const completedProjects = projects.filter(
            (p) => p.status === "completed"
        ).length;
        const delayedProjects = projects.filter(
            (p) => p.status === "on_hold" || p.status === "cancelled"
        ).length;
        const totalBudget = projects.reduce(
            (sum, p) => sum + (p.budget || 0),
            0
        );
        const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
        const totalTasks = projects.reduce(
            (sum, p) => sum + (p.works ? p.works.length : 0),
            0
        );
        const completedTasks = projects.reduce(
            (sum, p) =>
                sum +
                (p.works
                    ? p.works.filter((w) => w.status === "completed").length
                    : 0),
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
        logger.error("Error in getStatisticsService:", error.message);
        throw error;
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
        const statusDistribution = Object.entries(statusCounts).map(
            ([status, count]) => ({
                status,
                count,
                percentage:
                    totalProjects > 0
                        ? Math.round((count / totalProjects) * 100)
                        : 0,
            })
        );

        // Task distribution
        const taskCounts = {};
        projects.forEach((p) => {
            p.works.forEach((w) => {
                taskCounts[w.status] = (taskCounts[w.status] || 0) + 1;
            });
        });
        const taskDistribution = Object.entries(taskCounts).map(
            ([status, count]) => ({ status, count })
        );

        return {
            success: true,
            data: { statusDistribution, taskDistribution },
        };
    } catch (error) {
        logger.error("Error in getDistributionService:", error.message);
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
            return { success: true, data: project };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        logger.error("Error in createProjectService:", error.message);
        throw error;
    }
};

// Update project
export const updateProjectService = async (id, data) => {
    try {
        const transaction = await db.sequelize.transaction();
        try {
            const [updated] = await db.Project.update(data, {
                where: { id },
                transaction,
            });
            if (updated) {
                const project = await db.Project.findByPk(id, { transaction });
                await transaction.commit();
                return { success: true, data: project };
            }
            throw new Error("Dự án không tồn tại");
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        logger.error("Error in updateProjectService:", error.message);
        throw error;
    }
};

// Delete project
export const deleteProjectService = async (id) => {
    try {
        const transaction = await db.sequelize.transaction();
        try {
            const deleted = await db.Project.destroy({
                where: { id },
                transaction,
            });
            await transaction.commit();
            if (deleted > 0) {
                return {
                    success: true,
                    message: "Project deleted successfully",
                };
            }
            throw new Error("Dự án không tồn tại");
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        logger.error("Error in deleteProjectService:", error.message);
        throw error;
    }
};
