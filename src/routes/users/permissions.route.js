import express from "express";
import * as permissionControllers from "../../controllers/users/permission.controller.js";
// import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.use(authenticate);

// GET all permissions
router.get("/", permissionControllers.getAllPermissionsController);

// GET permission by ID
router.get("/:id", permissionControllers.getPermissionByIdController);

// Các route CRUD khác đã được loại bỏ - chỉ giữ lại read operations

export default router;
