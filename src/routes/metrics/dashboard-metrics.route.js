import express from "express";
import * as dashboardMetricControllers from "../../controllers/metrics/dashboard-metric.controller.js";

const router = express.Router();

// GET dashboard metrics
router.get("/", dashboardMetricControllers.getAllDashboardMetricsController);

// GET dashboard metrics for user
router.get("/user/:userId", dashboardMetricControllers.getDashboardMetricsByUserIdController);

// GET dashboard metrics by date
router.get("/date/:date", dashboardMetricControllers.getDashboardMetricsByDateController);

export default router;
