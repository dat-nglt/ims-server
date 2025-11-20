import express from "express";
import { getAllCheckInsController, getCheckInByIdController, checkInController, checkOutController, getCheckInHistoryByUserIdController } from "../controllers/checkIn.controller.js";

const router = express.Router();

// GET all check-ins
router.get("/", getAllCheckInsController);

// GET check-in history for user (phải ở trước /:id để tránh conflict)
router.get("/user/:userId", getCheckInHistoryByUserIdController);

// GET check-in by ID
router.get("/:id", getCheckInByIdController);

// CHECK-IN
router.post("/check-in", checkInController);

// CHECK-OUT
router.post("/:id/check-out", checkOutController);

export default router;
