import express from "express";
import * as roleControllers from "../../controllers/users/role.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js"; // Giả sử có middleware

const router = express.Router();

// Middleware cho tất cả routes
// router.use(authenticate);

// GET all roles
router.get("/", roleControllers.getAllRolesController);

// GET role by ID
router.get("/:id", roleControllers.getRoleByIdController);

// CREATE new role - chỉ admin
router.post("/", /* authorize(['manage_roles']), */ roleControllers.createRoleController);

// UPDATE role - chỉ admin
router.put("/:id", /* authorize(['manage_roles']), */ roleControllers.updateRoleController);

// DELETE role - chỉ admin
router.delete("/:id", /* authorize(['manage_roles']), */ roleControllers.deleteRoleController);

export default router;
