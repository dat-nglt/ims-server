import express from "express";
import {
    getAllUserRolePermissionsController,
    getUserPermissionsByUserIdController,
    grantPermissionToUserController,
    revokePermissionFromUserController,
} from "../../controllers/users/userRolePermission.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.use(authenticate);

// GET all user role permissions
router.get("/", getAllUserRolePermissionsController);

// GET user role permissions by user ID
router.get("/user/:userId", getUserPermissionsByUserIdController);

// GRANT permission to user - chỉ admin hoặc manager
router.post(
    "/",
    /* authorize(['manage_user_permissions']), */ grantPermissionToUserController
);

// REVOKE permission from user - chỉ admin hoặc manager
router.delete(
    "/:id",
    /* authorize(['manage_user_permissions']), */ revokePermissionFromUserController
);

export default router;
