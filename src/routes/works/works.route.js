import express from "express";
import {
    getAllWorksController,
    getWorksController,
    getWorksStatisticsController,
    getWorksDistributionController,
    getWorksByStatusController,
    createWorkController,
    updateWorkController,
    approveWorkController,
    deleteWorkController,
    getWorkCategoriesController,
    getServiceTypesController,
    exportWorksController,
    getWorkByCodeController,
    getTechnicianListToAssignController
} from "../../controllers/works/work.controller.js";

const router = express.Router();

// GET works with filters, pagination, search, sort
router.get("/", getWorksController);

router.get("/:workCode", getWorkByCodeController);

router.get("/technicians-list-to-assign", getTechnicianListToAssignController);

// GET all works (legacy, có thể giữ hoặc loại bỏ)
router.get("/all", getAllWorksController);

// GET works statistics
router.get("/statistics", getWorksStatisticsController);

// GET works distribution
router.get("/distribution", getWorksDistributionController);

// GET work categories
router.get("/categories", getWorkCategoriesController);

// GET service types
router.get("/service-types", getServiceTypesController);

// GET export works
router.get("/export", exportWorksController);

// GET works by status (phải ở trước /:id để tránh conflict)
router.get("/status/:status", getWorksByStatusController);

// GET work by ID

// CREATE new work
router.post("/", createWorkController);

// UPDATE work
router.put("/:id", updateWorkController);

// APPROVE work
router.patch("/:id/approve", approveWorkController);

// DELETE work
router.delete("/:id", deleteWorkController);

export default router;
