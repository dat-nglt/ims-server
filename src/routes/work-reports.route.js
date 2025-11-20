import express from "express";
import * as workReportController from "../controllers/IMS/workReport.controller.js";

const router = express.Router();

// GET all work reports
router.get("/", workReportController.getAllWorkReportsController);

// GET work report by ID
router.get("/:id", workReportController.getWorkReportByIdController);

// CREATE new work report
router.post("/", workReportController.createWorkReportController);

// UPDATE work report
router.put("/:id", workReportController.updateWorkReportController);

// APPROVE work report
router.put("/:id/approve", workReportController.approveWorkReportController);

// REJECT work report
router.put("/:id/reject", workReportController.rejectWorkReportController);

export default router;
