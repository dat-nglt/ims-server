import express from "express";
import * as projectsControllers from "../../controllers/projects/projects.controller.js";
// import authMiddleware from '../middlewares/authMiddleware.js'; // Uncomment if authentication is required

const router = express.Router();

// GET /api/projects - Fetch projects with filters, sorting, pagination
router.get("/", /* authMiddleware, */ projectsControllers.getProjectsController);

router.get("/category-for-work", /* authMiddleware, */ projectsControllers.getProjectsCategoryForWorkController);

// GET /api/projects/statistics - Get project statistics
router.get("/statistics", /* authMiddleware, */ projectsControllers.getStatisticsController);

// GET /api/projects/distribution - Get status and task distributions
router.get("/distribution", /* authMiddleware, */ projectsControllers.getDistributionController);

// POST /api/projects - Create a new project
router.post("/", /* authMiddleware, */ projectsControllers.createProjectController);

// PUT /api/projects/:id - Update a project
router.put("/:id", /* authMiddleware, */ projectsControllers.updateProjectController);

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", /* authMiddleware, */ projectsControllers.deleteProjectController);

// GET /api/projects/:id/history - Get project histories
router.get("/:id/history", /* authMiddleware, */ projectsControllers.getProjectHistoriesController);

export default router;
