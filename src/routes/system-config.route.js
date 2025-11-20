import express from "express";

const router = express.Router();

// GET all system config
router.get("/", (req, res) => {
  res.json({ message: "Get all system config - TODO" });
});

// GET system config by key
router.get("/:key", (req, res) => {
  res.json({ message: `Get system config ${req.params.key} - TODO` });
});

// SET system config
router.post("/", (req, res) => {
  res.json({ message: "Set system config - TODO" });
});

// UPDATE system config
router.put("/:key", (req, res) => {
  res.json({ message: `Update system config ${req.params.key} - TODO` });
});

// DELETE system config
router.delete("/:key", (req, res) => {
  res.json({ message: `Delete system config ${req.params.key} - TODO` });
});

export default router;
