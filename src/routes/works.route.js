import express from "express";
import { getAllWorksController, getWorksByStatusController, getWorkByIdController, createWorkController, updateWorkController, deleteWorkController } from "../controllers/work.controller.js";

const router = express.Router();

// GET all works
router.get("/", getAllWorksController);

// GET works by status (phải ở trước /:id để tránh conflict)
router.get("/status/:status", getWorksByStatusController);

// GET work by ID
router.get("/:id", getWorkByIdController);

// CREATE new work
router.post("/", createWorkController);

// UPDATE work
router.put("/:id", updateWorkController);

// DELETE work
router.delete("/:id", deleteWorkController);

export default router;
