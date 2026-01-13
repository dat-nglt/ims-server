import express from "express";
import * as userControllers from "../../controllers/users/user.controller.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// GET all users
router.get("/", checkAuth, userControllers.getAllUsersController);

// GET user by ID
router.get("/:id", userControllers.getUserByIdController);

// CREATE new user
router.post("/", userControllers.createUserController);

// UPDATE user
router.put("/:id", userControllers.updateUserController);

// DELETE user
router.delete("/:id", userControllers.deleteUserController);

// APPROVE user
router.put("/:employee_id/approve", userControllers.approveUserController);

// REJECT user
router.put("/:employee_id/reject", userControllers.rejectUserController);

export default router;
