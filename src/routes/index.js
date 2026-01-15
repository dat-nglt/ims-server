// Mini App Routes

import { routeForProfileMiniApp, routeForNotificationMiniApp } from "./mini-app/index.js";

// IMS Routes
import {
  routeForUsers,
  routeForRoles,
  routeForPermissions,
  routeForUserRole,
  routeForRolePermissions,
  routeForAuth,
} from "./users/index.js";
import { routeForProject } from "./projects/index.js";
import { routeForCustomers } from "./customers/index.js";
import {
  routeForWorks,
  routeForWorkCategories,
  routeForWorkAssignments,
  routeForWorkReports,
  routeForOvertimeRequests,
} from "./works/index.js";
import {
  routeForAttachments,
  routeForNotifications,
  routeForAttendance,
  routeForUploads,
  routeForAttendanceTypes,
  routeForOfficeAttendance,
} from "./operations/index.js";
import { routeForEmployeeProfiles, routeForDepartments, routeForPositions } from "./hr/index.js";
import { routeForSalesReports } from "./reports/index.js";
import { routeForPerformanceMetrics, routeForDashboardMetrics } from "./metrics/index.js";
import { routeForSystemConfig } from "./system/index.js";
import { routeForZaloWebhook } from "./webhooks/index.js";

const mainRouter = (server) => {
  // Mini App Routes
  server.use("/api/v1/ims/mini-app/profile", routeForProfileMiniApp);
  server.use("/api/v1/ims/mini-app/notification", routeForNotificationMiniApp);

  // --- IMS ROUTES (API v1) ---
  // User Management
  server.use("/api/v1/ims/users", routeForUsers);
  server.use("/api/v1/ims/auth", routeForAuth);
  server.use("/api/v1/ims/roles", routeForRoles);
  server.use("/api/v1/ims/permissions", routeForPermissions);
  server.use("/api/v1/ims/user-roles", routeForUserRole);
  server.use("/api/v1/ims/role-permissions", routeForRolePermissions);

  // Project Management
  server.use("/api/v1/ims/projects", routeForProject);

  // Customer Management
  server.use("/api/v1/ims/customers", routeForCustomers);

  // Work Management
  server.use("/api/v1/ims/works", routeForWorks);
  server.use("/api/v1/ims/work-categories", routeForWorkCategories);
  server.use("/api/v1/ims/work-assignments", routeForWorkAssignments);
  server.use("/api/v1/ims/work-reports", routeForWorkReports);
  server.use("/api/v1/ims/overtime-requests", routeForOvertimeRequests);

  // Operations
  server.use("/api/v1/ims/attendance", routeForAttendance);
  server.use("/api/v1/ims/attendance", routeForOfficeAttendance); // Office attendance routes
  server.use("/api/v1/ims/attendance-types", routeForAttendanceTypes);
  server.use("/api/v1/ims/uploads", routeForUploads);
  server.use("/api/v1/ims/attachments", routeForAttachments);
  server.use("/api/v1/ims/notifications", routeForNotifications);

  // HR & Management
  server.use("/api/v1/ims/employee-profiles", routeForEmployeeProfiles);
  server.use("/api/v1/ims/departments", routeForDepartments);
  server.use("/api/v1/ims/positions", routeForPositions);

  // Workflow & Reports
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
