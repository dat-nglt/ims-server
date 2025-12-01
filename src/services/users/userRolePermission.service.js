import db from "../../models/index.js";
import logger from "../../utils/logger.js";

/**
 * Lấy tất cả quyền hạn người dùng (không bao gồm đã xóa mềm)
 */
export const getAllUserRolePermissionsService = async () => {
  try {
    const permissions = await db.UserRolePermission.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'employee_id'],
        },
        {
          model: db.Permission,
          as: 'permission',
          attributes: ['id', 'name', 'description', 'category'],
        },
        {
          model: db.User,
          as: 'grantedByUser',
          attributes: ['id', 'name'],
        },
      ],
      order: [['granted_at', 'DESC']],
    });
    return { success: true, data: permissions };
  } catch (error) {
    logger.error("Error in getAllUserRolePermissionsService:", error.message);
    throw error;
  }
};

/**
 * Lấy quyền hạn của một người dùng
 */
export const getUserPermissionsByUserIdService = async (userId) => {
  try {
    const permissions = await db.UserRolePermission.findAll({
      where: {
        user_id: userId,
        is_granted: true,
        is_deleted: false,
        ...(process.env.NODE_ENV === 'production' && {
          expires_at: {
            [db.Sequelize.Op.or]: [
              { [db.Sequelize.Op.is]: null },
              { [db.Sequelize.Op.gt]: new Date() }
            ]
          }
        })
      },
      include: [
        {
          model: db.Permission,
          as: 'permission',
          attributes: ['id', 'name', 'description', 'category'],
        },
        {
          model: db.User,
          as: 'grantedByUser',
          attributes: ['id', 'name'],
        },
      ],
      order: [['granted_at', 'DESC']],
    });
    return { success: true, data: permissions };
  } catch (error) {
    logger.error("Error in getUserPermissionsByUserIdService:", error.message);
    throw error;
  }
};

/**
 * Cấp quyền cho người dùng
 */
export const grantPermissionToUserService = async (data) => {
  try {
    const { user_id, permission_id, granted_by, expires_at } = data;

    if (!user_id || !permission_id || !granted_by) {
      throw new Error("user_id, permission_id và granted_by là bắt buộc");
    }

    // Kiểm tra user tồn tại
    const user = await db.User.findByPk(user_id);
    if (!user || user.is_deleted) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra permission tồn tại
    const permission = await db.Permission.findByPk(permission_id);
    if (!permission || permission.is_deleted) {
      throw new Error("Quyền hạn không tồn tại");
    }

    // Kiểm tra đã có quyền chưa
    const existing = await db.UserRolePermission.findOne({
      where: {
        user_id,
        permission_id,
        is_deleted: false
      }
    });

    if (existing) {
      if (existing.is_granted) {
        throw new Error("Người dùng đã có quyền này");
      } else {
        // Reactive quyền
        await existing.update({
          is_granted: true,
          granted_by,
          granted_at: new Date(),
          expires_at,
          updated_by: granted_by,
          updated_at: new Date(),
        });
        return { success: true, data: existing };
      }
    }

    // Tạo mới
    const newPermission = await db.UserRolePermission.create({
      user_id,
      permission_id,
      is_granted: true,
      granted_by,
      expires_at,
    });

    return { success: true, data: newPermission };
  } catch (error) {
    logger.error("Error in grantPermissionToUserService:", error.message);
    throw error;
  }
};

/**
 * Thu hồi quyền từ người dùng (soft delete)
 */
export const revokePermissionFromUserService = async (id, updated_by) => {
  try {
    const permission = await db.UserRolePermission.findByPk(id);
    if (!permission || permission.is_deleted) {
      throw new Error("Quyền hạn người dùng không tồn tại");
    }

    await permission.update({
      is_granted: false,
      updated_by,
      updated_at: new Date(),
    });

    return { success: true, message: "Thu hồi quyền thành công" };
  } catch (error) {
    logger.error("Error in revokePermissionFromUserService:", error.message);
    throw error;
  }
};
