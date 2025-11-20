import express from "express";
import { getAllSystemConfigController, getSystemConfigByKeyController, createSystemConfigController, updateSystemConfigController, deleteSystemConfigController } from "../controllers/systemConfig.controller.js";

const router = express.Router();

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

export default router;
