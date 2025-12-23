import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Gán role(s) cho user
 * @param {string} userId - ID của user
 * @param {string|string[]} roleIds - ID role hoặc mảng IDs
 * @param {string} assignedById - ID của người gán role
 */
export const assignRoleService = async (userId, roleIds, assignedById) => {
  try {
    // Kiểm tra user tồn tại
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Chuyển đổi roleIds thành mảng nếu là string
    const roleIdArray = Array.isArray(roleIds) ? roleIds : [roleIds];
    if (roleIdArray.length === 0) {
      throw new Error("Phải cung cấp ít nhất một role");
    }

    // Kiểm tra tất cả roles tồn tại
    const roles = await db.Role.findAll({
      where: { id: roleIdArray },
    });
    if (roles.length !== roleIdArray.length) {
      throw new Error("Một hoặc nhiều role không tồn tại");
    }

    // Kiểm tra assignedById tồn tại
    const assigner = await db.User.findByPk(assignedById);
    if (!assigner) {
      throw new Error("Người gán không tồn tại");
    }

    // Validate quyền của assignedById (chỉ admin)
    const assignerWithRoles = await db.User.findOne({
      where: { id: assignedById },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
      ],
    });
    // if (
    //     !assignerWithRoles ||
    //     !assignerWithRoles.userRoles.some((r) => r.role.name === "admin")
    // ) {
    //     throw new Error("Không có quyền gán role");
    // }

    // Gán roles bằng cách bulk create bản ghi trong UserRoles
    const assignments = await db.UserRoles.bulkCreate(
      roleIdArray.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
        assigned_by: assignedById,
      })),
      { ignoreDuplicates: true } // Tránh lỗi duplicate key nếu role đã được gán
    );

    logger.info(
      `Roles ${roleIdArray.join(", ")} assigned to user ${userId} by ${assignedById}`
    );
    return {
      data: assignments,
      message: `${assignments.length} role(s) đã được gán thành công`,
    };
  } catch (error) {
    logger.error(`Error in assignRoleService: ${error.message}`);
    throw error;
  }
};

/**
 * Lấy danh sách roles của user
 */
export const getUserRolesService = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [
            {
              model: db.Role,
              as: "role",
              include: [
                {
                  model: db.Permission,
                  as: "permissions",
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });
    if (!user) {
      throw new Error("User không tồn tại");
    }
    logger.info(`Retrieved roles for user ${userId}`);
    return {
      data: user.userRoles,
      message: "Lấy danh sách roles thành công",
    };
  } catch (error) {
    logger.error(`Error in getUserRolesService: ${error.message}`);
    throw error;
  }
};

/**
 * Thu hồi role từ user
 */
export const revokeRoleService = async (userId, roleId, revokedById) => {
  try {
    // Kiểm tra userId tồn tại
    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Kiểm tra roleId tồn tại
    const role = await db.Role.findByPk(roleId);
    if (!role) {
      throw new Error("Role không tồn tại");
    }

    // Kiểm tra revokedById tồn tại
    const revoker = await db.User.findByPk(revokedById);
    if (!revoker) {
      throw new Error("Người thu hồi không tồn tại");
    }

    // Validate quyền của revokedById
    const revokerWithRoles = await db.User.findOne({
      where: { id: revokedById },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [{ model: db.Role, as: "role" }],
        },
      ],
    });
    if (
      !revokerWithRoles ||
      !revokerWithRoles.userRoles.some((r) => r.role.name === "admin")
    ) {
      throw new Error("Không có quyền thu hồi role");
    }

    // Thu hồi role
    const deletedRows = await db.UserRoles.destroy({
      where: { user_id: userId, role_id: roleId },
    });
    if (deletedRows === 0) {
      throw new Error("Role không tồn tại cho user này");
    }
    logger.info(
      `Role ${roleId} revoked from user ${userId} by ${revokedById}`
    );
    return { data: null, message: "Role đã được thu hồi thành công" };
  } catch (error) {
    logger.error(`Error in revokeRoleService: ${error.message}`);
    throw error;
  }
};

/**
 * Lấy danh sách quyền của user (từ roles)
 */
export const getUserPermissionsService = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.UserRoles,
          as: "userRoles",
          include: [
            {
              model: db.Role,
              as: "role",
              include: [
                {
                  model: db.Permission,
                  as: "permissions",
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });
    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Thu thập quyền từ roles
    const rolePermissions = new Set();
    user.userRoles.forEach((userRole) => {
      userRole.role.permissions.forEach((perm) =>
        rolePermissions.add(perm)
      );
    });

    const allPermissions = Array.from(rolePermissions).map((perm) => ({
      id: perm.id,
      name: perm.name,
      source: "role",
    }));

    logger.info(`Retrieved permissions for user ${userId}`);
    return {
      data: allPermissions,
      message: "Lấy danh sách quyền thành công",
    };
  } catch (error) {
    logger.error(`Error in getUserPermissionsService: ${error.message}`);
    throw error;
  }
};
