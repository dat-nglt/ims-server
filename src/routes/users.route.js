import express from "express";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  res.json({ message: "Get all users - TODO" });
});

// GET user by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id} - TODO` });
});

// CREATE new user
router.post("/", (req, res) => {
  res.json({ message: "Create user - TODO" });
});

// UPDATE user
router.put("/:id", (req, res) => {
  res.json({ message: `Update user ${req.params.id} - TODO` });
});

// DELETE user
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete user ${req.params.id} - TODO` });
});

export default router;
