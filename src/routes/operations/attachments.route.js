import express from "express";
import {
    getAllAttachmentsController,
    getAttachmentByIdController,
    uploadAttachmentController,
    deleteAttachmentController,
    getAttachmentsByWorkIdController,
} from "../../controllers/operations/attachment.controller.js";

const router = express.Router();

// GET all attachments
router.get("/", getAllAttachmentsController);

// GET attachment by ID
router.get("/:id", getAttachmentByIdController);

// UPLOAD attachment
router.post("/", uploadAttachmentController);

// DELETE attachment
router.delete("/:id", deleteAttachmentController);

// GET attachments by work ID
router.get("/work/:workId", getAttachmentsByWorkIdController);

export default router;
