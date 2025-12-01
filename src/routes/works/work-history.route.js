import express from "express";
import {
    getAllWorkHistoriesController,
    getWorkHistoryByWorkIdController,
    createWorkHistoryController,
    updateWorkHistoryNotesController,
    deleteWorkHistoryController,
} from "../../controllers/works/workHistory.controller.js";

const router = express.Router();

// GET all work history with filters and pagination
router.get("/", getAllWorkHistoriesController);

// GET work history by work ID
router.get("/work/:workId", getWorkHistoryByWorkIdController);

// POST create new work history entry
router.post("/", createWorkHistoryController);

// PUT update notes for a history entry
router.put("/:id/notes", updateWorkHistoryNotesController);

// DELETE a history entry
router.delete("/:id", deleteWorkHistoryController);

export default router;
