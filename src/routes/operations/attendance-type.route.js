import express from "express";
import * as attendanceTypeControllers from "../../controllers/operations/attendance-type.controller.js";

const router = express.Router();

// GET all notifications for user
router.get("/", attendanceTypeControllers.getAllAttendanceTypesController);

export default router;
