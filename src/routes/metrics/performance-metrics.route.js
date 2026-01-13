import express from "express";
import * as performanceMetricControllers from "../../controllers/metrics/performance-metric.controller.js";

const router = express.Router();

// GET all performance metrics
router.get("/", performanceMetricControllers.getAllPerformanceMetricsController);

// GET performance metric by user and month
router.get(
    "/user/:userId/month/:month",
    performanceMetricControllers.getPerformanceMetricByUserAndMonthController
);

export default router;
