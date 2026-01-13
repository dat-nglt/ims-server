import express from "express";
import * as systemConfigControllers from "../../controllers/system/system-config.controller.js";

const router = express.Router();

// Routes cũ cho cấu hình theo key
// GET all system config
router.get("/", systemConfigControllers.getAllSystemConfigController);

// GET system config by key
router.get("/:key", systemConfigControllers.getSystemConfigByKeyController);

// SET system config
router.post("/", systemConfigControllers.createSystemConfigController);

// UPDATE system config
router.put("/:key", systemConfigControllers.updateSystemConfigController);

// DELETE system config
router.delete("/:key", systemConfigControllers.deleteSystemConfigController);

// Routes mới cho toàn bộ cài đặt hệ thống
// GET toàn bộ cài đặt hệ thống
router.get("/settings/full", systemConfigControllers.getSystemSettingsController);

// PUT cập nhật toàn bộ cài đặt hệ thống
router.put("/settings/full", systemConfigControllers.updateSystemSettingsController);

export default router;
