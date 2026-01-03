import express from "express";
import {
  getAllWorkAssignmentsController,
  getWorkAssignmentForTechnicianController,
  createWorkAssignmentController,
  updateWorkAssignmentController,
  acceptWorkAssignmentController,
  rejectWorkAssignmentController,
  startWorkAssignmentController,
  completeWorkAssignmentController,
  getWorkAssignmentsByWorkIdController,
} from "../../controllers/works/work-assignment.controller.js";

const router = express.Router();

// GET all work assignments (legacy)
router.get("/all", getAllWorkAssignmentsController);

// GET work assignment for technician by ID
router.get("/:id", getWorkAssignmentForTechnicianController);

// CREATE new work assignment
router.post("/", createWorkAssignmentController);

// UPDATE work assignment
router.put("/:id", updateWorkAssignmentController);

// ACCEPT work assignment
router.put("/:id/accept", acceptWorkAssignmentController);

// REJECT work assignment
router.put("/:id/reject", rejectWorkAssignmentController);

// START work assignment
router.put("/:id/start", startWorkAssignmentController);

// COMPLETE work assignment
router.put("/:id/complete", completeWorkAssignmentController);

// GET work assignments by work ID
router.get("/work/:workId", getWorkAssignmentsByWorkIdController);

export default router;
