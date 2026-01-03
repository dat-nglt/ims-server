import express from "express";
import { getAllAttendanceTypesController } from "../../controllers/operations/attendance-type.controller.js";

const router = express.Router();

// GET all notifications for user
router.get("/", getAllAttendanceTypesController);

export default router;
