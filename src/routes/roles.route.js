import express from "express";
import { getAllRolesController, getRoleByIdController, createRoleController, updateRoleController, deleteRoleController } from "../controllers/role.controller.js";

const router = express.Router();

// GET all roles
router.get("/", getAllRolesController);

// GET role by ID
router.get("/:id", getRoleByIdController);

// CREATE new role
router.post("/", createRoleController);

// UPDATE role
router.put("/:id", updateRoleController);

// DELETE role
router.delete("/:id", deleteRoleController);

export default router;
