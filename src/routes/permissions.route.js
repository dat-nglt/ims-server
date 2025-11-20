import express from "express";
import { getAllPermissionsController, getPermissionByIdController, createPermissionController, updatePermissionController, deletePermissionController } from "../controllers/permission.controller.js";

const router = express.Router();

// GET all permissions
router.get("/", getAllPermissionsController);

// GET permission by ID
router.get("/:id", getPermissionByIdController);

// CREATE new permission
router.post("/", createPermissionController);

// UPDATE permission
router.put("/:id", updatePermissionController);

// DELETE permission
router.delete("/:id", deletePermissionController);

export default router;
