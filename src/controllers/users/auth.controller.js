import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import logger from "../../utils/logger.js";
import * as userService from "../../services/users/index.js";
import { refreshTokenService } from "../../services/users/auth.service.js";

/**
 * Tính toán appsecret_proof cho Zalo API
 * @param {string} accessToken - Access token từ Zalo
 * @param {string} appSecret - Zalo App Secret Key
 * @returns {string} appsecret_proof
 */
const calculateAppSecretProof = (accessToken, appSecret) => {
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(accessToken);
  return hmac.digest("hex");
};

/**
 * Đăng nhập bằng số điện thoại và mật khẩu
 */
export const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(200).json({
        status: "error",
        success: false,
        message: "Vui lòng nhập số điện thoại và mật khẩu",
      });
    }

    // Tìm user theo phone
    const userResult = await userService.getUserByPhoneService(phone);

    console.log("Thông tin người dùng: ", userResult.data.userRoles);

    if (!userResult.success) {
      return res.status(200).json({
        status: "error",
        success: false,
        message: "Số điện thoại hoặc mật khẩu không đúng",
      });
    }

    const user = userResult.data;

    // Kiểm tra trạng thái
    if (!user.is_active || user.status !== "active") {
      return res.status(200).json({
        status: "error",
        success: false,
        message: "Tài khoản đã bị khóa hoặc không hoạt động",
      });
    }

    // Kiểm tra trạng thái phê duyệt
    if (user.approved !== "approved") {
      return res.status(200).json({
        status: "error",
        success: false,
        message: user.approved === "rejected" ? "Tài khoản đã bị từ chối phê duyệt" : "Tài khoản đang chờ phê duyệt",
      });
    }

    // Kiểm tra mật khẩu
    if (!user.password) {
      return res.status(200).json({
        status: "error",
        success: false,
        message: "Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu",
      });
    }

    const isPasswordValid = password === user.password;
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        status: "error",
        success: false,
        message: "Số điện thoại hoặc mật khẩu không đúng",
      });
    }

    // Tạo token
    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.userRoles.length > 0 ? user.userRoles : [9999],
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.userRoles || 9999,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Cập nhật last_login
    await userService.updateUserService(user.id, {
      last_login: new Date(),
    });

    // Lấy thông tin đầy đủ người dùng
    const userDetailsResult = await userService.getUserByIdService(user.id);
    if (!userDetailsResult.success) {
      throw new Error("Không thể lấy thông tin người dùng");
    }
    const fullUser = userDetailsResult.data;

    res.json({
      status: "success",
      success: true,
      data: {
        user: fullUser,
        access_token: token,
        refresh_token: refreshToken,
      },
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in loginController:` + error.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi server",
    });
  }
};

/**
 * Đăng nhập qua Zalo Mini App
 */
export const zaloLoginController = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu access token từ Zalo",
      });
    }

    // Gọi Zalo Open API để lấy thông tin profile
    const ZALO_APP_SECRET_KEY = process.env.ZALO_SECRET_KEY;
    if (!ZALO_APP_SECRET_KEY) {
      logger.error(`[${req.id}] ZALO_SECRET_KEY not configured`);
      return res.status(500).json({
        status: "error",
        message: "Cấu hình server không đúng",
      });
    }

    const appSecretProof = calculateAppSecretProof(access_token, ZALO_APP_SECRET_KEY);

    const zaloResponse = await axios.get("https://graph.zalo.me/v2.0/me", {
      headers: {
        access_token: access_token,
        appsecret_proof: appSecretProof,
      },
      params: {
        fields: "id,name,picture",
      },
      timeout: 10000, // 10 seconds timeout
    });

    logger.info(`[${req.id}] Zalo API response from https://graph.zalo.me/v2.0/me: ${zaloResponse.status}`);

    const zaloProfile = zaloResponse.data;

    if (!zaloProfile.id) {
      return res.status(400).json({
        status: "error",
        message: "Không thể lấy thông tin từ Zalo",
      });
    }

    // Tìm user theo zalo_id
    let userResult = await userService.getUserByZaloIdService(zaloProfile.id);

    let user;
    if (!userResult.success) {
      // Tạo tài khoản mới nếu chưa tồn tại
      const userData = {
        avatar_url: zaloProfile.picture?.data?.url || null,
        name: zaloProfile.name,
        phone: null, // Có thể để null hoặc yêu cầu cập nhật sau
        email: `zalo_${zaloProfile.id}@temp.com`, // Email tạm thời
        zalo_id: zaloProfile.id,
        employee_id: zaloProfile.id, // Tạo employee_id unique từ timestamp và phần cuối zalo_id
        status: "active",
        is_active: true,
        approved: "pending",
      };

      console.log(userData);

      const createResult = await userService.createUserService(userData);
      if (!createResult.success) {
        return res.status(500).json({
          status: "error",
          message: "Không thể tạo tài khoản mới",
        });
      }
      user = createResult.data;
    } else {
      user = userResult.data;
    }

    // Kiểm tra trạng thái
    if (!user.is_active || user.status !== "active") {
      return res.status(200).json({
        status: "success",
        data: {
          user: user,
          access_token: null,
          refresh_token: null,
        },
        message: "Tài khoản đã bị khóa hoặc không hoạt động",
      });
    }

    // Kiểm tra trạng thái phê duyệt
    if (user.approved !== "approved") {
      return res.status(200).json({
        status: "success",
        data: {
          user: user,
          access_token: null,
          refresh_token: null,
        },
        message: user.approved === "rejected" ? "Tài khoản đã bị từ chối phê duyệt" : "Tài khoản đang chờ phê duyệt",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        zalo_id: user.zalo_id,
        role: user.role || "user",
      },
      process.env.JWT_SECRET || "ims-secret-key",
      { expiresIn: "24h" }
    );

    // Cập nhật last_login
    await userService.updateUserService(user.id, {
      last_login: new Date(),
    });

    // Lấy thông tin đầy đủ người dùng
    const userDetailsResult = await userService.getUserByIdService(user.id);
    if (!userDetailsResult.success) {
      throw new Error("Không thể lấy thông tin người dùng");
    }
    const fullUser = userDetailsResult.data;

    res.json({
      status: "success",
      data: {
        user: fullUser,
        access_token: token,
        refresh_token: null,
      },
      message: userResult.success ? "Đăng nhập qua Zalo thành công" : "Tạo tài khoản và đăng nhập thành công",
    });
  } catch (error) {
    logger.error(`[${req.id}] Error in zaloLoginController:` + error.message);

    // Handle Zalo API errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return res.status(401).json({
          status: "error",
          message: "Access token từ Zalo không hợp lệ hoặc đã hết hạn",
        });
      }

      if (status === 403) {
        return res.status(403).json({
          status: "error",
          message: "Không có quyền truy cập thông tin Zalo",
        });
      }

      logger.error(`[${req.id}] Zalo API error:`, { status, data });
    }

    // Handle network/timeout errors
    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        status: "error",
        message: "Timeout khi kết nối đến Zalo servers",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Lỗi server",
    });
  }
};

/**
 * Controller cho refresh token: Nhận refresh_token từ body, gọi service để tạo access_token mới
 */
export const refreshTokenController = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const newAccessToken = await refreshTokenService(refresh_token);
    res.status(200).json({ access_token: newAccessToken });
  } catch (error) {
    res.status(401).json({
      message: error.message || "Invalid refresh token",
    });
  }
};
