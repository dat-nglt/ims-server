import express from "express";
import * as employeeProfileControllers from "../../controllers/hr/employee-profile.controller.js";

const router = express.Router();

// GET all employee profiles
router.get("/", employeeProfileControllers.getAllEmployeeProfilesController);

// GET employee profile by user ID
router.get("/user/:employee_id", employeeProfileControllers.getEmployeeProfileByUserIdController);

router.get("/has-profile", employeeProfileControllers.getAllEmployeeWithProfileController);

// CREATE employee profile

// UPDATE employee profile
router.put("/user/:userId", employeeProfileControllers.updateEmployeeProfileController);

export default router;
