import express from "express";

const router = express.Router();

// GET all permissions
router.get("/", (req, res) => {
  res.json({ message: "Get all permissions - TODO" });
});

// GET permission by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get permission ${req.params.id} - TODO` });
});

// CREATE new permission
router.post("/", (req, res) => {
  res.json({ message: "Create permission - TODO" });
});

// UPDATE permission
router.put("/:id", (req, res) => {
  res.json({ message: `Update permission ${req.params.id} - TODO` });
});

// DELETE permission
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete permission ${req.params.id} - TODO` });
});

export default router;
