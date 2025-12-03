import express from "express";
import {
    getAllPerformanceMetricsController,
    getPerformanceMetricByUserAndMonthController,
} from "../../controllers/metrics/performanceMetric.controller.js";

const router = express.Router();

// GET all performance metrics
router.get("/", getAllPerformanceMetricsController);

// GET performance metric by user and month
router.get(
    "/user/:userId/month/:month",
    getPerformanceMetricByUserAndMonthController
);

export default router;
