import express from "express";
import {
    getAllDashboardMetricsController,
    getDashboardMetricsByUserIdController,
    getDashboardMetricsByDateController,
} from "../../controllers/metrics/dashboard-metric.controller.js";

const router = express.Router();

// GET dashboard metrics
router.get("/", getAllDashboardMetricsController);

// GET dashboard metrics for user
router.get("/user/:userId", getDashboardMetricsByUserIdController);

// GET dashboard metrics by date
router.get("/date/:date", getDashboardMetricsByDateController);

export default router;
