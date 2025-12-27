import express from "express";
import {
  getAllWorkAssignmentsController,
  getWorkAssignmentsController,
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

// GET work assignments with filters and pagination
// Query params: ?page=1&limit=20&technician_id=1&work_id=1&assigned_status=pending&assigned_by=1
router.get("/", getWorkAssignmentsController);

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
