import express from "express";

const router = express.Router();

// GET all performance metrics
router.get("/", (req, res) => {
  res.json({ message: "Get all performance metrics - TODO" });
});

// GET performance metric by user and month
router.get("/user/:userId/month/:month", (req, res) => {
  res.json({ message: `Get performance metrics for user ${req.params.userId} in month ${req.params.month} - TODO` });
});

// CREATE performance metric
router.post("/", (req, res) => {
  res.json({ message: "Create performance metric - TODO" });
});

// UPDATE performance metric
router.put("/:id", (req, res) => {
  res.json({ message: `Update performance metric ${req.params.id} - TODO` });
});

export default router;
