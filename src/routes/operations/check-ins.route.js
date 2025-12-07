import express from "express";
import {
    getAllCheckInsController,
    getCheckInByIdController,
    checkInController,
    checkOutController,
    getCheckInHistoryByUserIdController,
    // getLocationController,
    // Thêm imports mới cho TrackWorkMap
    getTechniciansLocationsController,
    getOfficeLocationController,
    getTechnicianLocationHistoryController,
    getJobItemsLocationsController,
} from "../../controllers/operations/check-in.controller.js";

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

// Routes mới cho TrackWorkMap
// GET danh sách vị trí kỹ thuật viên
router.get("/history/locations", getTechniciansLocationsController);

// GET vị trí văn phòng
router.get("/office/location", getOfficeLocationController);

// GET lịch sử vị trí kỹ thuật viên
router.get(
    "/technicians/:technicianId/location-history",
    getTechnicianLocationHistoryController
);

// GET vị trí công việc
router.get("/job-items/locations", getJobItemsLocationsController);

export default router;
