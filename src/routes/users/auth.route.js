import express from "express";
import { checkAuth } from "../../middlewares/auth.middleware.js";
import {
    loginController,
    zaloLoginController,
    registerController,
    linkZaloIdController,
    refreshTokenController, // Thêm import cho refresh token controller
} from "../../controllers/users/auth.controller.js";

const router = express.Router();

// POST /api/auth/login - Đăng nhập bằng phone & password
router.post("/login", loginController);

// POST /api/auth/zalo-login - Đăng nhập qua Zalo
router.post("/zalo-login", zaloLoginController);

// POST /api/auth/register - Đăng ký tài khoản mới
router.post("/register", registerController);

// POST /api/auth/link-zalo - Liên kết Zalo ID (cần auth middleware)
router.post("/link-zalo", checkAuth, linkZaloIdController);

// POST /api/auth/refresh-token - Làm mới access token bằng refresh token
router.post("/refresh-token", refreshTokenController);

export default router;