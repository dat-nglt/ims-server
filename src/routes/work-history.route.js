import express from "express";

const router = express.Router();

// GET all work history
router.get("/", (req, res) => {
  res.json({ message: "Get all work history - TODO" });
});

// GET work history by work ID
router.get("/work/:workId", (req, res) => {
  res.json({ message: `Get work history for work ${req.params.workId} - TODO` });
});

export default router;
