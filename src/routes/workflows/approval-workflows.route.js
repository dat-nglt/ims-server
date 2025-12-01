import express from "express";
import {
    getAllApprovalWorkflowsController,
    getApprovalWorkflowByIdController,
    createApprovalWorkflowController,
    approveWorkflowStepController,
    rejectWorkflowStepController,
} from "../../controllers/workflows/approvalWorkflow.controller.js";

const router = express.Router();

// GET all approval workflows
router.get("/", getAllApprovalWorkflowsController);

// GET approval workflow by ID
router.get("/:id", getApprovalWorkflowByIdController);

// CREATE approval workflow
router.post("/", createApprovalWorkflowController);

// APPROVE step
router.put("/:id/approve", approveWorkflowStepController);

// REJECT step
router.put("/:id/reject", rejectWorkflowStepController);

export default router;
