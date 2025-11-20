import express from "express";

const router = express.Router();

// GET all attachments
router.get("/", (req, res) => {
  res.json({ message: "Get all attachments - TODO" });
});

// GET attachment by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get attachment ${req.params.id} - TODO` });
});

// UPLOAD attachment
router.post("/", (req, res) => {
  res.json({ message: "Upload attachment - TODO" });
});

// DELETE attachment
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete attachment ${req.params.id} - TODO` });
});

// GET attachments by work ID
router.get("/work/:workId", (req, res) => {
  res.json({ message: `Get attachments for work ${req.params.workId} - TODO` });
});

export default router;
