import express from "express";
import { getAllUserRolePermissionsController, getUserPermissionsByUserIdController, grantPermissionToUserController, revokePermissionFromUserController } from "../controllers/userRolePermission.controller.js";

const router = express.Router();

// GET all user role permissions
router.get("/", getAllUserRolePermissionsController);

// GET user role permissions by user ID
router.get("/user/:userId", getUserPermissionsByUserIdController);

// GRANT permission to user
router.post("/", grantPermissionToUserController);

// REVOKE permission from user
router.delete("/:id", revokePermissionFromUserController);

export default router;
