import express from "express";

const router = express.Router();

// GET dashboard metrics
router.get("/", (req, res) => {
  res.json({ message: "Get dashboard metrics - TODO" });
});

// GET dashboard metrics for user
router.get("/user/:userId", (req, res) => {
  res.json({ message: `Get dashboard metrics for user ${req.params.userId} - TODO` });
});

// GET dashboard metrics by date
router.get("/date/:date", (req, res) => {
  res.json({ message: `Get dashboard metrics for date ${req.params.date} - TODO` });
});

export default router;
