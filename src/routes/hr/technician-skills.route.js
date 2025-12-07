import express from "express";
import {
    getAllTechnicianSkillsController,
    getTechnicianSkillByTechnicianIdController,
    updateTechnicianSkillController,
    deleteTechnicianSkillController,
    createTechnicianSkillController,
} from "../../controllers/hr/technician-skill.controller.js";

const router = express.Router();

// GET all technician skills
router.get("/", getAllTechnicianSkillsController);

// GET technician skills by technician ID
router.get(
    "/technician/:technicianId",
    getTechnicianSkillByTechnicianIdController
);

// ASSIGN skill level to technician
router.post("/", createTechnicianSkillController);

// UPDATE technician skill
router.put("/:id", updateTechnicianSkillController);

// DELETE technician skill
router.delete("/:id", deleteTechnicianSkillController);

export default router;
