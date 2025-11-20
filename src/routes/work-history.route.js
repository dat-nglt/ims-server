import express from "express";
import { getAllWorkHistoriesController, getWorkHistoryByWorkIdController } from "../controllers/workHistory.controller.js";

const router = express.Router();

// GET all work history
router.get("/", getAllWorkHistoriesController);

// GET work history by work ID
router.get("/work/:workId", getWorkHistoryByWorkIdController);

export default router;
