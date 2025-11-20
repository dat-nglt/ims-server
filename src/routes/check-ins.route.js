import express from "express";
import * as checkInController from "../controllers/IMS/checkIn.controller.js";

const router = express.Router();

// GET all check-ins
router.get("/", checkInController.getAllCheckInsController);

// GET check-in history for user (phải ở trước /:id để tránh conflict)
router.get("/user/:userId", checkInController.getCheckInHistoryByUserIdController);

// GET check-in by ID
router.get("/:id", checkInController.getCheckInByIdController);

// CHECK-IN
router.post("/check-in", checkInController.checkInController);

// CHECK-OUT
router.post("/:id/check-out", checkInController.checkOutController);

export default router;
