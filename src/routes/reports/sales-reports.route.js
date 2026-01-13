import express from "express";
import * as salesReportControllers from "../../controllers/reports/sales-report.controller.js";

const router = express.Router();

// GET all sales reports
router.get("/", salesReportControllers.getAllSalesReportsController);

// GET sales report by ID
router.get("/:id", salesReportControllers.getSalesReportByIdController);

// CREATE sales report
router.post("/", salesReportControllers.createSalesReportController);

// UPDATE sales report
router.put("/:id", salesReportControllers.updateSalesReportController);

// GET sales report by date range
router.get("/date-range", salesReportControllers.getSalesReportsByDateRangeController);

export default router;
