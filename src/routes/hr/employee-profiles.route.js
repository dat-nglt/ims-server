import express from "express";
import {
    getAllEmployeeProfilesController,
    getAllEmployeeWithProfileController,
    getEmployeeProfileByUserIdController,
    updateEmployeeProfileController,
} from "../../controllers/hr/employee-profile.controller.js";

const router = express.Router();

// GET all employee profiles
router.get("/", getAllEmployeeProfilesController);

// GET employee profile by user ID
router.get("/user/:employee_id", getEmployeeProfileByUserIdController);

router.get("/has-profile", getAllEmployeeWithProfileController);

// CREATE employee profile

// UPDATE employee profile
router.put("/user/:userId", updateEmployeeProfileController);

export default router;
