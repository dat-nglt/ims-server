import express from "express";
import {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
} from "../../controllers/users/user.controller.js";

const router = express.Router();

// GET all users
router.get("/", getAllUsersController);

// GET user by ID
router.get("/:id", getUserByIdController);

// CREATE new user
router.post("/", createUserController);

// UPDATE user
router.put("/:id", updateUserController);

// DELETE user
router.delete("/:id", deleteUserController);

export default router;
