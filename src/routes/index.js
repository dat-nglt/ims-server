// IMS Routes
import routeForUsers from "./users.route.js";
import routeForRoles from "./roles.route.js";
import routeForPermissions from "./permissions.route.js";
import routeForUserRolePermissions from "./user-role-permissions.route.js";
import routeForWorks from "./works.route.js";
import routeForWorkCategories from "./work-categories.route.js";
import routeForWorkAssignments from "./work-assignments.route.js";
import routeForWorkReports from "./work-reports.route.js";
import routeForWorkHistory from "./work-history.route.js";
import routeForCheckIns from "./check-ins.route.js";
import routeForAttachments from "./attachments.route.js";
import routeForNotifications from "./notifications.route.js";
import routeForEmployeeProfiles from "./employee-profiles.route.js";
import routeForTechnicianSkills from "./technician-skills.route.js";
import routeForApprovalWorkflows from "./approval-workflows.route.js";
import routeForSalesReports from "./sales-reports.route.js";
import routeForPerformanceMetrics from "./performance-metrics.route.js";
import routeForDashboardMetrics from "./dashboard-metrics.route.js";
import routeForSystemConfig from "./system-config.route.js";

const mainRouter = (server) => {
    // --- IMS ROUTES (API v1) ---
    // User Management
    server.use("/api/v1/ims/users", routeForUsers);
    server.use("/api/v1/ims/roles", routeForRoles);
    server.use("/api/v1/ims/permissions", routeForPermissions);
    server.use("/api/v1/ims/user-role-permissions", routeForUserRolePermissions);

    // Work Management
    server.use("/api/v1/ims/works", routeForWorks);
    server.use("/api/v1/ims/work-categories", routeForWorkCategories);
    server.use("/api/v1/ims/work-assignments", routeForWorkAssignments);
    server.use("/api/v1/ims/work-reports", routeForWorkReports);
    server.use("/api/v1/ims/work-history", routeForWorkHistory);

    // Operations
    server.use("/api/v1/ims/check-ins", routeForCheckIns);
    server.use("/api/v1/ims/attachments", routeForAttachments);
    server.use("/api/v1/ims/notifications", routeForNotifications);

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
};

export default mainRouter;
