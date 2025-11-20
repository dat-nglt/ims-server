import express from "express";
import { getAllSalesReportsController, getSalesReportByIdController, createSalesReportController, updateSalesReportController, getSalesReportsByDateRangeController } from "../controllers/salesReport.controller.js";

const router = express.Router();

// GET all sales reports
router.get("/", getAllSalesReportsController);

// GET sales report by ID
router.get("/:id", getSalesReportByIdController);

// CREATE sales report
router.post("/", createSalesReportController);

// UPDATE sales report
router.put("/:id", updateSalesReportController);

// GET sales report by date range
router.get("/date-range", getSalesReportsByDateRangeController);

export default router;
