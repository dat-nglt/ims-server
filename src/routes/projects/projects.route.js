import express from "express";
import {
    getProjectsController,
    getStatisticsController,
    getDistributionController,
    createProjectController,
    updateProjectController,
    deleteProjectController,
} from "../../controllers/projects/projects.controller.js";
// import authMiddleware from '../middlewares/authMiddleware.js'; // Uncomment if authentication is required

const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/", /* authMiddleware, */ getProjectsController);

// GET /api/projects/statistics - Get project statistics
router.get("/statistics", /* authMiddleware, */ getStatisticsController);

// GET /api/projects/distribution - Get status and task distributions
router.get("/distribution", /* authMiddleware, */ getDistributionController);

// POST /api/projects - Create a new project
router.post("/", /* authMiddleware, */ createProjectController);

// PUT /api/projects/:id - Update a project
router.put("/:id", /* authMiddleware, */ updateProjectController);

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", /* authMiddleware, */ deleteProjectController);

export default router;
