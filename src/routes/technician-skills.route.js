import express from "express";
import * as technicianSkillController from "../controllers/IMS/technicianSkill.controller.js";

const router = express.Router();

// GET all technician skills
router.get("/", technicianSkillController.getAllTechnicianSkillsController);

// GET technician skills by technician ID
router.get("/technician/:technicianId", technicianSkillController.getTechnicianSkillByTechnicianIdController);

// ASSIGN skill level to technician
router.post("/", technicianSkillController.assignTechnicianSkillController);

// UPDATE technician skill
router.put("/:id", technicianSkillController.updateTechnicianSkillController);

// DELETE technician skill
router.delete("/:id", technicianSkillController.deleteTechnicianSkillController);

export default router;
