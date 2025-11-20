import express from "express";
import { getAllWorkAssignmentsController, getWorkAssignmentByIdController, createWorkAssignmentController, acceptWorkAssignmentController, rejectWorkAssignmentController, completeWorkAssignmentController } from "../controllers/workAssignment.controller.js";

const router = express.Router();

// GET all work assignments
router.get("/", getAllWorkAssignmentsController);

// GET work assignment by ID
router.get("/:id", getWorkAssignmentByIdController);

// CREATE new work assignment
router.post("/", createWorkAssignmentController);

// ACCEPT work assignment
router.put("/:id/accept", acceptWorkAssignmentController);

// REJECT work assignment
router.put("/:id/reject", rejectWorkAssignmentController);

// COMPLETE work assignment
router.put("/:id/complete", completeWorkAssignmentController);

export default router;
