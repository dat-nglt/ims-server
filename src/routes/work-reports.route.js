import express from "express";
import { getAllWorkReportsController, getWorkReportByIdController, createWorkReportController, updateWorkReportController, approveWorkReportController, rejectWorkReportController } from "../controllers/workReport.controller.js";

const router = express.Router();

// GET all work reports
router.get("/", getAllWorkReportsController);

// GET work report by ID
router.get("/:id", getWorkReportByIdController);

// CREATE new work report
router.post("/", createWorkReportController);

// UPDATE work report
router.put("/:id", updateWorkReportController);

// APPROVE work report
router.put("/:id/approve", approveWorkReportController);

// REJECT work report
router.put("/:id/reject", rejectWorkReportController);

export default router;
