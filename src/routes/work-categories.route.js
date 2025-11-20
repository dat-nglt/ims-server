import express from "express";
import { getAllWorkCategoriesController, getWorkCategoryByIdController, createWorkCategoryController, updateWorkCategoryController, deleteWorkCategoryController } from "../controllers/workCategory.controller.js";

const router = express.Router();

// GET all work categories
router.get("/", getAllWorkCategoriesController);

// GET work category by ID
router.get("/:id", getWorkCategoryByIdController);

// CREATE new work category
router.post("/", createWorkCategoryController);

// UPDATE work category
router.put("/:id", updateWorkCategoryController);

// DELETE work category
router.delete("/:id", deleteWorkCategoryController);

export default router;
