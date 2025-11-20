import express from "express";

const router = express.Router();

// GET all employee profiles
router.get("/", (req, res) => {
  res.json({ message: "Get all employee profiles - TODO" });
});

// GET employee profile by user ID
router.get("/user/:userId", (req, res) => {
  res.json({ message: `Get employee profile for user ${req.params.userId} - TODO` });
});

// CREATE employee profile
router.post("/", (req, res) => {
  res.json({ message: "Create employee profile - TODO" });
});

// UPDATE employee profile
router.put("/user/:userId", (req, res) => {
  res.json({ message: `Update employee profile for user ${req.params.userId} - TODO` });
});

export default router;
