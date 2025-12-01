import express from "express";
import {
    getAllRolesController,
    getRoleByIdController,
    createRoleController,
    updateRoleController,
    deleteRoleController,
} from "../../controllers/users/role.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js"; // Giả sử có middleware

const router = express.Router();

// Middleware cho tất cả routes
// router.use(authenticate);

// GET all roles
router.get("/", getAllRolesController);

// GET role by ID
router.get("/:id", getRoleByIdController);

// CREATE new role - chỉ admin
router.post("/", /* authorize(['manage_roles']), */ createRoleController);

// UPDATE role - chỉ admin
router.put("/:id", /* authorize(['manage_roles']), */ updateRoleController);

// DELETE role - chỉ admin
router.delete("/:id", /* authorize(['manage_roles']), */ deleteRoleController);

export default router;
