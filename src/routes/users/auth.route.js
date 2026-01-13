import express from "express";
import { checkAuth } from "../../middlewares/auth.middleware.js";
import * as authControllers from "../../controllers/users/auth.controller.js";

const router = express.Router();

// POST /api/auth/login - Đăng nhập bằng phone & password
router.post("/login", authControllers.loginController);

// POST /api/auth/zalo-login - Đăng nhập qua Zalo
router.post("/zalo-login", authControllers.zaloLoginController);

// POST /api/auth/link-zalo - Liên kết Zalo ID (cần auth middleware)

// POST /api/auth/refresh-token - Làm mới access token bằng refresh token
router.post("/refresh-token", authControllers.refreshTokenController);

export default router;
