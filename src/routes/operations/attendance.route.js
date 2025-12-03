import express from "express";
import {
    getAttendanceSummaryController,
    getAttendanceStatisticsController,
} from "../../controllers/operations/attendance.controller.js";

const router = express.Router();

// GET dữ liệu tổng quan chấm công
router.get("/summary", getAttendanceSummaryController);

// GET thống kê chấm công
router.get("/statistics", getAttendanceStatisticsController);

export default router;
