import express from "express";
import * as attachmentControllers from "../../controllers/operations/attachment.controller.js";

const router = express.Router();

// GET all attachments
router.get("/", attachmentControllers.getAllAttachmentsController);

// GET attachment by ID
router.get("/:id", attachmentControllers.getAttachmentByIdController);

// UPLOAD attachment
router.post("/", attachmentControllers.uploadAttachmentController);

// DELETE attachment
router.delete("/:id", attachmentControllers.deleteAttachmentController);

// GET attachments by work ID
router.get("/work/:workId", attachmentControllers.getAttachmentsByWorkIdController);

export default router;
