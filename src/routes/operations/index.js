import routeForCheckIns from "./check-ins.route.js";
import routeForAttachments from "./attachments.route.js";
import routeForNotifications from "./notifications.route.js";
import attendanceRoute from "./attendance.route.js"; // Thêm import mới

export {    
    routeForCheckIns,
    routeForAttachments,
    routeForNotifications,
    attendanceRoute, // Export mới để tách biệt nếu cần
};