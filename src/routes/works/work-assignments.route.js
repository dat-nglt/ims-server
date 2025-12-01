import express from "express";
import {
  getAllWorkAssignmentsController,
  getWorkAssignmentsController,
  getWorkAssignmentByIdController,
  createWorkAssignmentController,
  updateWorkAssignmentController,
  acceptWorkAssignmentController,
  rejectWorkAssignmentController,
  startWorkAssignmentController,
  completeWorkAssignmentController,
} from "../../controllers/works/workAssignment.controller.js";

const router = express.Router();

// GET work assignments with filters and pagination
// Query params: ?page=1&limit=20&technician_id=1&work_id=1&assigned_status=pending&assigned_by=1
router.get("/", getWorkAssignmentsController);

// GET all work assignments (legacy)
router.get("/all", getAllWorkAssignmentsController);

// GET work assignment by ID
router.get("/:id", getWorkAssignmentByIdController);

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

export default router;
