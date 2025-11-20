import express from "express";
import * as workController from "../controllers/IMS/work.controller.js";

const router = express.Router();

// GET all works
router.get("/", workController.getAllWorksController);

// GET works by status (phải ở trước /:id để tránh conflict)
router.get("/status/:status", workController.getWorksByStatusController);

// GET work by ID
router.get("/:id", workController.getWorkByIdController);

// CREATE new work
router.post("/", workController.createWorkController);

// UPDATE work
router.put("/:id", workController.updateWorkController);

// DELETE work
router.delete("/:id", workController.deleteWorkController);

export default router;
