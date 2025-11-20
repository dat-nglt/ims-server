import express from "express";
import * as workCategoryController from "../controllers/IMS/workCategory.controller.js";

const router = express.Router();

// GET all work categories
router.get("/", workCategoryController.getAllWorkCategoriesController);

// GET work category by ID
router.get("/:id", workCategoryController.getWorkCategoryByIdController);

// CREATE new work category
router.post("/", workCategoryController.createWorkCategoryController);

// UPDATE work category
router.put("/:id", workCategoryController.updateWorkCategoryController);

// DELETE work category
router.delete("/:id", workCategoryController.deleteWorkCategoryController);

export default router;
