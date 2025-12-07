import express from "express";
import {
    getAllSystemConfigController,
    getSystemConfigByKeyController,
    createSystemConfigController,
    updateSystemConfigController,
    deleteSystemConfigController,
    getSystemSettingsController,
    updateSystemSettingsController,
} from "../../controllers/system/system-config.controller.js";

const router = express.Router();

// Routes cũ cho cấu hình theo key
// GET all system config
router.get("/", getAllSystemConfigController);

// GET system config by key
router.get("/:key", getSystemConfigByKeyController);

// SET system config
router.post("/", createSystemConfigController);

// UPDATE system config
router.put("/:key", updateSystemConfigController);

// DELETE system config
router.delete("/:key", deleteSystemConfigController);

// Routes mới cho toàn bộ cài đặt hệ thống
// GET toàn bộ cài đặt hệ thống
router.get("/settings/full", getSystemSettingsController);

// PUT cập nhật toàn bộ cài đặt hệ thống
router.put("/settings/full", updateSystemSettingsController);

export default router;
