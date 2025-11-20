import express from "express";

const router = express.Router();

// GET all approval workflows
router.get("/", (req, res) => {
    res.json({ message: "Get all approval workflows - TODO" });
});

// GET approval workflow by ID
router.get("/:id", (req, res) => {
    res.json({ message: `Get approval workflow ${req.params.id} - TODO` });
});

// CREATE approval workflow
router.post("/", (req, res) => {
    res.json({ message: "Create approval workflow - TODO" });
});

// APPROVE step
router.put("/:id/approve", (req, res) => {
    res.json({ message: `Approve workflow step ${req.params.id} - TODO` });
});

// REJECT step
router.put("/:id/reject", (req, res) => {
    res.json({ message: `Reject workflow step ${req.params.id} - TODO` });
});

export default router;
