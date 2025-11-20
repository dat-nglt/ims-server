import express from "express";

const router = express.Router();

// GET all work assignments
router.get("/", (req, res) => {
  res.json({ message: "Get all work assignments - TODO" });
});

// GET work assignment by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get work assignment ${req.params.id} - TODO` });
});

// CREATE new work assignment
router.post("/", (req, res) => {
  res.json({ message: "Create work assignment - TODO" });
});

// ACCEPT work assignment
router.put("/:id/accept", (req, res) => {
  res.json({ message: `Accept work assignment ${req.params.id} - TODO` });
});

// REJECT work assignment
router.put("/:id/reject", (req, res) => {
  res.json({ message: `Reject work assignment ${req.params.id} - TODO` });
});

// COMPLETE work assignment
router.put("/:id/complete", (req, res) => {
  res.json({ message: `Complete work assignment ${req.params.id} - TODO` });
});

export default router;
