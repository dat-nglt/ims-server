import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  approveUserController,
  rejectUserController,
} from "../../controllers/users/user.controller.js";
import { checkAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// GET all users
router.get("/", checkAuth, getAllUsersController);

// GET user by ID
router.get("/:id", getUserByIdController);

// CREATE new user
router.post("/", createUserController);

// UPDATE user
router.put("/:id", updateUserController);

// DELETE user
router.delete("/:id", deleteUserController);

// APPROVE user
router.put("/:employee_id/approve", approveUserController);

// REJECT user
router.put("/:employee_id/reject", rejectUserController);

export default router;
