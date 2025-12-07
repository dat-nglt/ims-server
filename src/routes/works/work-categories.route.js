import express from "express";
import {
    getAllWorkCategoriesController,
    getWorkCategoryByIdController,
    createWorkCategoryController,
    updateWorkCategoryController,
    deleteWorkCategoryController,
} from "../../controllers/works/work-category.controller.js";

const router = express.Router();

// GET all work categories with pagination and search
// Query params: ?page=1&limit=20&search=name&is_active=true
router.get("/", getAllWorkCategoriesController);

// GET work category by ID
router.get("/:id", getWorkCategoryByIdController);

// CREATE new work category
router.post("/", createWorkCategoryController);

// UPDATE work category
router.put("/:id", updateWorkCategoryController);

// DELETE work category (soft delete)
router.delete("/:id", deleteWorkCategoryController);

export default router;
