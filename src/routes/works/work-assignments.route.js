import express from "express";
import * as workAssignmentControllers from "../../controllers/works/work-assignment.controller.js";

const router = express.Router();

// GET all work assignments (legacy)
router.get("/all", workAssignmentControllers.getAllWorkAssignmentsController);

// GET work assignment for technician by ID
router.get("/:id", workAssignmentControllers.getWorkAssignmentForTechnicianController);

// CREATE new work assignment
router.post("/", workAssignmentControllers.createWorkAssignmentController);

// UPDATE work assignment
router.put("/:id", workAssignmentControllers.updateWorkAssignmentController);

// ACCEPT work assignment
router.put("/:id/accept", workAssignmentControllers.acceptWorkAssignmentController);

// REJECT work assignment
router.put("/:id/reject", workAssignmentControllers.rejectWorkAssignmentController);

// GET work assignments by work ID
router.get("/work/:workId", workAssignmentControllers.getWorkAssignmentsByWorkIdController);

export default router;
