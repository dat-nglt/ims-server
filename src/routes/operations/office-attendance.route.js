import express from "express";
import * as officeAttendanceControllers from "../../controllers/operations/office-attendance.controller.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Routes: /operations/attendance/office
 * Chấm công cho khối văn phòng
 */

// POST /office/check-in - Chấm công vào văn phòng
router.post("/office/check-in", checkAuth, officeAttendanceControllers.checkInOfficeController);

// POST /office/check-out - Chấm công ra văn phòng
router.post("/office/check-out", checkAuth, officeAttendanceControllers.checkOutOfficeController);

export default router;
