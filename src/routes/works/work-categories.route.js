import express from "express";
import * as workCategoryControllers from "../../controllers/works/work-category.controller.js";

const router = express.Router();

// Query params: ?page=1&limit=20&search=name&is_active=true
router.get("/", workCategoryControllers.getAllWorkCategoriesController);

// GET work category by ID
router.get("/:id", workCategoryControllers.getWorkCategoryByIdController);

// CREATE new work category
router.post("/", workCategoryControllers.createWorkCategoryController);

// UPDATE work category
router.put("/:id", workCategoryControllers.updateWorkCategoryController);

// DELETE work category (soft delete)
router.delete("/:id", workCategoryControllers.deleteWorkCategoryController);

export default router;
