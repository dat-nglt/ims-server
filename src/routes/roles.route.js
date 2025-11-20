import express from "express";

const router = express.Router();

// GET all roles
router.get("/", (req, res) => {
  res.json({ message: "Get all roles - TODO" });
});

// GET role by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get role ${req.params.id} - TODO` });
});

// CREATE new role
router.post("/", (req, res) => {
  res.json({ message: "Create role - TODO" });
});

// UPDATE role
router.put("/:id", (req, res) => {
  res.json({ message: `Update role ${req.params.id} - TODO` });
});

// DELETE role
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete role ${req.params.id} - TODO` });
});

export default router;
