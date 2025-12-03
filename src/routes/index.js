// IMS Routes
import {
    routeForUsers,
    routeForRoles,
    routeForPermissions,
    routeForUserRole,
    routeForRolePermissions,
} from "./users/index.js";
import { routeForProject } from "./projects/index.js";
import {
    routeForWorks,
    routeForWorkCategories,
    routeForWorkAssignments,
    routeForWorkReports,
} from "./works/index.js";
import {
    routeForCheckIns,
    routeForAttachments,
    routeForNotifications,
    attendanceRoute, // Thêm import mới nếu muốn tách biệt
} from "./operations/index.js";
import {
    routeForEmployeeProfiles,
    routeForTechnicianSkills,
} from "./hr/index.js";
import { routeForApprovalWorkflows } from "./workflows/index.js";
import { routeForSalesReports } from "./reports/index.js";
import {
    routeForPerformanceMetrics,
    routeForDashboardMetrics,
} from "./metrics/index.js";
import { routeForSystemConfig } from "./system/index.js";
import { routeForZaloWebhook } from "./webhooks/index.js";

const mainRouter = (server) => {
    // --- IMS ROUTES (API v1) ---
    // User Management
    server.use("/api/v1/ims/users", routeForUsers);
    server.use("/api/v1/ims/roles", routeForRoles);
    server.use("/api/v1/ims/permissions", routeForPermissions);
    server.use("/api/v1/ims/user-roles", routeForUserRole);
    server.use("/api/v1/ims/role-permissions", routeForRolePermissions);

    // Project Management
    server.use("/api/v1/ims/projects", routeForProject);

    // Work Management
    server.use("/api/v1/ims/works", routeForWorks);
    server.use("/api/v1/ims/work-categories", routeForWorkCategories);
    server.use("/api/v1/ims/work-assignments", routeForWorkAssignments);
    server.use("/api/v1/ims/work-reports", routeForWorkReports);

    // Operations
    server.use("/api/v1/ims/check-ins", routeForCheckIns);
    server.use("/api/v1/ims/attachments", routeForAttachments);
    server.use("/api/v1/ims/notifications", routeForNotifications);
    // Thêm use mới nếu muốn tách biệt attendance
    server.use("/api/v1/ims/attendance", attendanceRoute);

    // HR & Management
    server.use("/api/v1/ims/employee-profiles", routeForEmployeeProfiles);
    server.use("/api/v1/ims/technician-skills", routeForTechnicianSkills);

    // Workflow & Reports
    server.use("/api/v1/ims/approval-workflows", routeForApprovalWorkflows);
    server.use("/api/v1/ims/sales-reports", routeForSalesReports);

    // Metrics & Dashboard
    server.use("/api/v1/ims/performance-metrics", routeForPerformanceMetrics);
    server.use("/api/v1/ims/dashboard-metrics", routeForDashboardMetrics);

    // System Configuration
    server.use("/api/v1/ims/system-config", routeForSystemConfig);

    // Webhooks
    server.use("/api/v1/ims/zalo-webhook", routeForZaloWebhook);
};

export default mainRouter;
