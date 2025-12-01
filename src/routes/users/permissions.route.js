import express from "express";
import {
    getAllPermissionsController,
    getPermissionByIdController,
    createPermissionController,
    updatePermissionController,
    deletePermissionController,
} from "../../controllers/users/permission.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.use(authenticate);

// GET all permissions
router.get("/", getAllPermissionsController);

// GET permission by ID
router.get("/:id", getPermissionByIdController);

// CREATE new permission - chỉ admin
router.post(
    "/",
    /* authorize(['manage_permissions']), */ createPermissionController
);

// UPDATE permission - chỉ admin
router.put(
    "/:id",
    /* authorize(['manage_permissions']), */ updatePermissionController
);

// DELETE permission - chỉ admin
router.delete(
    "/:id",
    /* authorize(['manage_permissions']), */ deletePermissionController
);

export default router;
