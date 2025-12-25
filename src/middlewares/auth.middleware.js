// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { getUserByIdService, getUserRolesService, getUserPermissionsService } from "../services/users/user.service.js";

/**
 * Middleware xác thực JWT token
 * Kiểm tra token hợp lệ và gắn thông tin user vào request
 */
export const checkAuth = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn(`[${req.id}] Missing authorization header`);
      return res.status(401).json({
        status: "error",
        message: "Xác thực thất bại: Yêu cầu cần có token.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn(`[${req.id}] Invalid authorization header format`);
      return res.status(401).json({
        status: "error",
        message: "Xác thực thất bại: Định dạng token không hợp lệ.",
      });
    }

    // // 2. Xác thực token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // // 3. Kiểm tra user tồn tại và active
    const userResult = await getUserByIdService(decodedToken.userId);
    if (!userResult.success) {
      logger.warn(`[${req.id}] User ${decodedToken.userId} not found or inactive`);
      return res.status(401).json({
        status: "error",
        message: "Người dùng không tồn tại hoặc đã bị khóa.",
      });
    }

    const user = userResult.data;

    // // Kiểm tra trạng thái account
    if (!user.is_active || user.status !== "active") {
      logger.warn(`[${req.id}] User ${user.id} account inactive or suspended`);
      return res.status(403).json({
        status: "error",
        message: "Tài khoản đã bị khóa hoặc không hoạt động.",
      });
    }

    // // 4. Lấy roles và permissions của user
    const rolesPermissionsResult = await getUserRolesService(user.id);
    const permissionsResult = await getUserPermissionsService(user.id);

    // // 5. Gắn thông tin user vào request (chỉ giữ mảng ID cho roles & permissions)
    const rolesData = rolesPermissionsResult.success ? rolesPermissionsResult.data : [];
    const permsData = permissionsResult && permissionsResult.success ? permissionsResult.data : [];

    const roleIds = rolesData.map((r) => r.id);
    const permIds = permsData.map((p) => p.id);
    const roleNames = rolesData.map((r) => r.name);
    // const permissionNames = permsData.map((p) => p.name); //Tuỳ chọn giữ tên permission

    const reqUser = {
      userId: user.id,
      employeeId: user.employee_id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      zaloId: user.zalo_id,
      roles: roleIds.length ? roleIds : [9999],
      permissions: permIds,
      roleNames,
      // permissionNames, //Tuỳ chọn giữ tên permission
      role: roleNames.length ? roleNames[0] : null,
      avatarUrl: user.avatar_url,
      department: user.profile && user.profile.department ? user.profile.department : user.department,
      position: user.position,
    };

    logger.warn(JSON.stringify(reqUser));

    req.user = reqUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn(`[${req.id}] Token expired for user`);
      return res.status(401).json({
        status: "error",
        message: "Xác thực thất bại: Token đã hết hạn.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      logger.warn(`[${req.id}] Invalid JWT token`);
      return res.status(401).json({
        status: "error",
        message: "Xác thực thất bại: Token không hợp lệ.",
      });
    }

    logger.error(`[${req.id}] Auth middleware error:`, error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server trong quá trình xác thực.",
    });
  }
};

/**
 * Middleware kiểm tra quyền Admin
 * Yêu cầu user phải có role 'admin'
 */
export const checkAdmin = (req, res, next) => {
  if (!req.user) {
    logger.error(`[${req.id}] checkAdmin called without checkAuth`);
    return res.status(500).json({
      status: "error",
      message: "Lỗi xác thực: Chưa chạy middleware checkAuth.",
    });
  }

  // Kiểm tra role admin
  if (req.user.role !== "admin") {
    logger.warn(`[${req.id}] Access denied: User ${req.user.name} attempted admin action`);
    return res.status(403).json({
      status: "error",
      message: "Truy cập bị từ chối: Yêu cầu quyền Quản trị viên (Admin).",
    });
  }

  logger.info(`[${req.id}] Admin access granted for user: ${req.user.name}`);
  next();
};

/**
 * Middleware kiểm tra role cụ thể
 * @param {string|string[]} allowedRoles - Role(s) được phép
 */
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error(`[${req.id}] checkRole called without checkAuth`);
      return res.status(500).json({
        status: "error",
        message: "Lỗi xác thực: Chưa chạy middleware checkAuth.",
      });
    }

    const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // User roles may be stored as an array of IDs (number) or role objects; support both
    const userRoleIds = Array.isArray(req.user.roles)
      ? req.user.roles.map((r) => Number(typeof r === "object" ? r.id : r))
      : [];
    const userRoleNames = Array.isArray(req.user.roleNames)
      ? req.user.roleNames
      : Array.isArray(req.user.roles) && typeof req.user.roles[0] === "string"
      ? req.user.roles
      : [];

    const allowedIds = allowedRolesArray
      .map((r) => (typeof r === "number" ? r : Number(r)))
      .filter((n) => !Number.isNaN(n));
    const allowedNames = allowedRolesArray.filter((r) => typeof r === "string");

    const hasRequiredRole =
      allowedIds.some((id) => userRoleIds.includes(id)) ||
      allowedNames.some((name) => userRoleNames.includes(name) || req.user.role === name);

    if (!hasRequiredRole) {
      logger.warn(
        `[${req.id}] Access denied: User ${req.user.name} lacks required role(s): ${allowedRolesArray.join(", ")}`
      );
      return res.status(403).json({
        status: "error",
        message: `Truy cập bị từ chối: Yêu cầu một trong các role: ${allowedRolesArray.join(", ")}.`,
      });
    }

    logger.info(`[${req.id}] Role access granted for user: ${req.user.name} with roles: ${userRoles.join(", ")}`);
    next();
  };
};

/**
 * Middleware kiểm tra permission cụ thể
 * @param {string|string[]} requiredPermissions - Permission(s) yêu cầu
 */
export const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error(`[${req.id}] checkPermission called without checkAuth`);
      return res.status(500).json({
        status: "error",
        message: "Lỗi xác thực: Chưa chạy middleware checkAuth.",
      });
    }

    const userPermissions = req.user.permissions.map((perm) => perm.name);
    const requiredPermsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    const hasAllPermissions = requiredPermsArray.every((perm) => userPermissions.includes(perm));

    if (!hasAllPermissions) {
      logger.warn(
        `[${req.id}] Access denied: User ${req.user.name} lacks required permission(s): ${requiredPermsArray.join(
          ", "
        )}`
      );
      return res.status(403).json({
        status: "error",
        message: `Truy cập bị từ chối: Thiếu quyền: ${requiredPermsArray.join(", ")}.`,
      });
    }

    logger.info(
      `[${req.id}] Permission access granted for user: ${req.user.name} with permissions: ${userPermissions.join(", ")}`
    );
    next();
  };
};

/**
 * Middleware kiểm tra ownership (user chỉ có thể truy cập tài nguyên của mình)
 * @param {string} ownerField - Tên field chứa user ID trong request params/body
 */
export const checkOwnership = (ownerField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      logger.error(`[${req.id}] checkOwnership called without checkAuth`);
      return res.status(500).json({
        status: "error",
        message: "Lỗi xác thực: Chưa chạy middleware checkAuth.",
      });
    }

    const resourceOwnerId = req.params[ownerField] || req.body[ownerField];

    if (!resourceOwnerId) {
      logger.warn(`[${req.id}] Ownership check failed: No owner field found`);
      return res.status(400).json({
        status: "error",
        message: "Không tìm thấy thông tin chủ sở hữu tài nguyên.",
      });
    }

    if (req.user.userId !== parseInt(resourceOwnerId) && req.user.role !== "admin") {
      logger.warn(
        `[${req.id}] Ownership violation: User ${req.user.name} tried to access resource of user ${resourceOwnerId}`
      );
      return res.status(403).json({
        status: "error",
        message: "Truy cập bị từ chối: Bạn chỉ có thể truy cập tài nguyên của mình.",
      });
    }

    logger.info(`[${req.id}] Ownership check passed for user: ${req.user.name}`);
    next();
  };
};

/**
 * Middleware kết hợp multiple checks
 * @param {Object} options - Các tùy chọn kiểm tra
 * @param {string|string[]} options.roles - Roles yêu cầu
 * @param {string|string[]} options.permissions - Permissions yêu cầu
 * @param {boolean} options.requireOwnership - Yêu cầu ownership check
 * @param {string} options.ownerField - Field name cho ownership check
 */
export const checkAccess = (options = {}) => {
  return async (req, res, next) => {
    try {
      // Check roles if specified
      if (options.roles) {
        const allowedRolesArray = Array.isArray(options.roles) ? options.roles : [options.roles];

        const userRoleIds = Array.isArray(req.user.roles)
          ? req.user.roles.map((r) => Number(typeof r === "object" ? r.id : r))
          : [];
        const userRoleNames = Array.isArray(req.user.roleNames)
          ? req.user.roleNames
          : Array.isArray(req.user.roles) && typeof req.user.roles[0] === "string"
          ? req.user.roles
          : [];

        const allowedIds = allowedRolesArray
          .map((r) => (typeof r === "number" ? r : Number(r)))
          .filter((n) => !Number.isNaN(n));
        const allowedNames = allowedRolesArray.filter((r) => typeof r === "string");

        const hasRequiredRole =
          allowedIds.some((id) => userRoleIds.includes(id)) ||
          allowedNames.some((name) => userRoleNames.includes(name) || req.user.role === name);

        if (!hasRequiredRole) {
          logger.warn(`[${req.id}] Access denied: Missing role(s) ${allowedRolesArray.join(", ")}`);
          return res.status(403).json({
            status: "error",
            message: `Truy cập bị từ chối: Yêu cầu role: ${allowedRolesArray.join(" hoặc ")}.`,
          });
        }
      }

      // Check permissions if specified
      if (options.permissions) {
        const userPermissions = req.user.permissions.map((perm) => perm.name);
        const requiredPermsArray = Array.isArray(options.permissions) ? options.permissions : [options.permissions];

        const hasAllPermissions = requiredPermsArray.every((perm) => userPermissions.includes(perm));

        if (!hasAllPermissions) {
          logger.warn(`[${req.id}] Access denied: Missing permission(s) ${requiredPermsArray.join(", ")}`);
          return res.status(403).json({
            status: "error",
            message: `Truy cập bị từ chối: Thiếu quyền: ${requiredPermsArray.join(", ")}.`,
          });
        }
      }

      // Check ownership if required
      if (options.requireOwnership) {
        const ownerField = options.ownerField || "userId";
        const resourceOwnerId = req.params[ownerField] || req.body[ownerField];

        if (resourceOwnerId && req.user.userId !== parseInt(resourceOwnerId) && req.user.role !== "admin") {
          logger.warn(`[${req.id}] Ownership violation for resource owner ${resourceOwnerId}`);
          return res.status(403).json({
            status: "error",
            message: "Truy cập bị từ chối: Bạn chỉ có thể truy cập tài nguyên của mình.",
          });
        }
      }

      logger.info(`[${req.id}] Access check passed for user: ${req.user.name}`);
      next();
    } catch (error) {
      logger.error(`[${req.id}] Error in checkAccess:`, error);
      res.status(500).json({
        status: "error",
        message: "Lỗi server trong quá trình kiểm tra quyền truy cập.",
      });
    }
  };
};
