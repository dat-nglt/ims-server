import express from "express";

const router = express.Router();

// GET all notifications for user
router.get("/", (req, res) => {
  res.json({ message: "Get all notifications - TODO" });
});

// GET notification by ID
router.get("/:id", (req, res) => {
  res.json({ message: `Get notification ${req.params.id} - TODO` });
});

// MARK notification as read
router.put("/:id/read", (req, res) => {
  res.json({ message: `Mark notification ${req.params.id} as read - TODO` });
});

// DELETE notification
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete notification ${req.params.id} - TODO` });
});

// GET unread notifications count
router.get("/unread/count", (req, res) => {
  res.json({ message: "Get unread notifications count - TODO" });
});

export default router;
