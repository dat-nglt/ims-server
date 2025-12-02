import express from "express";
import {
    getAllTechnicianSkillsController,
    getTechnicianSkillByTechnicianIdController,
    createTechnicianSkillController,
    updateTechnicianSkillController,
    deleteTechnicianSkillController,
} from "../../controllers/hr/technicianSkill.controller.js";

const router = express.Router();

// GET all technician skills
router.get("/", getAllTechnicianSkillsController);

// GET technician skill by technician ID
router.get("/technician/:technicianId", getTechnicianSkillByTechnicianIdController);

// CREATE technician skill
router.post("/", createTechnicianSkillController);

// UPDATE technician skill
router.put("/technician/:technicianId", updateTechnicianSkillController);

// DELETE technician skill
router.delete("/:id", deleteTechnicianSkillController);

export default router;
