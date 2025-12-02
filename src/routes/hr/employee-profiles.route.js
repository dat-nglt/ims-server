import express from "express";
import {
    getAllEmployeeProfilesController,
    getEmployeeProfileByUserIdController,
    createEmployeeProfileController,
    updateEmployeeProfileController,
} from "../../controllers/hr/employeeProfile.controller.js";

const router = express.Router();

// GET all employee profiles
router.get("/", getAllEmployeeProfilesController);

// GET employee profile by user ID
router.get("/user/:userId", getEmployeeProfileByUserIdController);
    
// CREATE employee profile
router.post("/", createEmployeeProfileController);

// UPDATE employee profile
router.put("/user/:userId", updateEmployeeProfileController);

export default router;
