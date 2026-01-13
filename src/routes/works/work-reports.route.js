import express from "express";
import * as workReportControllers from "../../controllers/works/work-report.controller.js";

const router = express.Router();

// GET all work reports
router.get("/", workReportControllers.getAllWorkReportsController);

// GET work report by ID
router.get("/:id", workReportControllers.getWorkReportByIdController);

// CREATE new work report
router.post("/", workReportControllers.createWorkReportController);

// UPDATE work report
router.put("/:id", workReportControllers.updateWorkReportController);

// APPROVE work report
router.put("/:id/approve", workReportControllers.approveWorkReportController);

// REJECT work report
router.put("/:id/reject", workReportControllers.rejectWorkReportController);

export default router;
