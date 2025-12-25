import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Service: Get all positions
 *
 * Lấy danh sách tất cả chức vụ với lọc theo:
 * - departmentId: ID của phòng ban
 * - level: Cấp độ chức vụ
 * - status: Trạng thái
 * - includeRoles: Có bao gồm danh sách vai trò hay không
 * - includeInactive: Có bao gồm chức vụ inactive hay không
 *
 * @param {Object} filters - Điều kiện lọc
 * @returns {Object} { success, data, message, total }
 */
export const getAllPositionsService = async (filters = {}) => {
  try {
    const { departmentId, level, status = "active", includeRoles = false, includeInactive = false } = filters;

    // Build where clause
    const where = { is_deleted: false };

    if (departmentId) {
      where.department_id = departmentId;
    }

    if (level) {
      where.level = level;
    }

    if (!includeInactive && !status) {
      where.status = "active";
    } else if (status) {
      where.status = status;
    }

    // Build include
    const include = [
      {
        association: "department",
        attributes: ["id", "name", "code"],
      },
    ];

    include.push({
      association: "positionRoles",
      include: [
        {
          association: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    // Get positions with parent-child relationships
    include.push({
      association: "parentPosition",
      attributes: ["id", "name", "code"],
      required: false,
    });

    include.push({
      association: "childPositions",
      attributes: ["id", "name", "code"],
      required: false,
    });

    const positions = await db.Position.findAll({
      where,
      include,
      order: [["created_at", "DESC"]],
    });

    if (!positions || positions.length === 0) {
      return {
        success: true,
        data: [],
        message: "Không có chức vụ nào",
        total: 0,
      };
    }

    return {
      success: true,
      data: positions,
      message: "Lấy danh sách chức vụ thành công",
      total: positions.length,
    };
  } catch (error) {
    logger.error("Error in getAllPositionsService:", error.message);
    return {
      success: false,
      message: `Lỗi khi lấy danh sách chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Get position by ID
 *
 * @param {number} positionId - ID của chức vụ
 * @returns {Object} { success, data, message }
 */
export const getPositionByIdService = async (positionId) => {
  try {
    const position = await db.Position.findByPk(positionId, {
      include: [
        {
          association: "department",
          attributes: ["id", "name", "code"],
        },
        {
          association: "positionRoles",
          include: [
            {
              association: "role",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: "parentPosition",
          attributes: ["id", "name", "code"],
        },
        {
          association: "childPositions",
          attributes: ["id", "name", "code"],
        },
        {
          association: "users",
          attributes: ["id", "email", "full_name"],
        },
        {
          association: "creator",
          attributes: ["id", "full_name", "email"],
        },
        {
          association: "updater",
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!position || position.is_deleted) {
      return {
        success: false,
        message: `Không tìm thấy chức vụ có ID ${positionId}`,
      };
    }

    return {
      success: true,
      data: position,
      message: "Lấy chi tiết chức vụ thành công",
    };
  } catch (error) {
    logger.error("Error in getPositionByIdService:", error.message);
    return {
      success: false,
      message: `Lỗi khi lấy chi tiết chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Create position
 *
 * Tạo chức vụ mới
 *
 * @param {Object} positionData - Dữ liệu chức vụ
 * @param {number} createdBy - ID của người tạo
 * @returns {Object} { success, data, message }
 */
export const createPositionService = async (positionData, createdBy) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Validate required fields
    if (!positionData.name || !positionData.department_id) {
      throw new Error("Tên chức vụ và phòng ban là bắt buộc");
    }

    // Check if department exists
    const department = await db.Department.findByPk(positionData.department_id, { transaction });

    if (!department) {
      throw new Error(`Không tìm thấy phòng ban có ID ${positionData.department_id}`);
    }

    // Check if position with same name and department already exists
    const existingPosition = await db.Position.findOne({
      where: {
        name: positionData.name,
        department_id: positionData.department_id,
        is_deleted: false,
      },
      transaction,
    });

    if (existingPosition) {
      throw new Error("Chức vụ với tên này đã tồn tại trong phòng ban này");
    }

    // Check if parent position exists (if provided)
    if (positionData.parent_position_id) {
      const parentPosition = await db.Position.findByPk(positionData.parent_position_id, { transaction });

      if (!parentPosition || parentPosition.is_deleted) {
        throw new Error(`Không tìm thấy chức vụ cha có ID ${positionData.parent_position_id}`);
      }
    }

    // Create position
    const newPosition = await db.Position.create(
      {
        ...positionData,
        created_by: createdBy,
        updated_by: createdBy,
      },
      { transaction }
    );

    // Fetch full position data
    const position = await db.Position.findByPk(newPosition.id, {
      include: [
        {
          association: "department",
          attributes: ["id", "name", "code"],
        },
      ],
      transaction,
    });

    await transaction.commit();

    logger.info(`Position created: ${newPosition.id} by user ${createdBy}`);

    return {
      success: true,
      data: position,
      message: "Tạo chức vụ thành công",
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in createPositionService:", error.message);
    return {
      success: false,
      message: `Lỗi khi tạo chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Cập nhật chức vụ
 *
 * Mô tả:
 * - Cập nhật các trường của Position trong một giao dịch DB (transaction).
 * - Nếu `department_id` thay đổi, tất cả Users có `position_id` này sẽ được cập nhật
 *   `department_id` để đảm bảo tính nhất quán dữ liệu.
 * - Nếu `positionRoles` được cung cấp, các PositionRoles sẽ được đồng bộ:
 *   * Vai trò mới được thêm vào Position sẽ được gán cho tất cả Users đang giữ Position đó.
 *   * Vai trò bị gỡ khỏi Position sẽ bị xóa khỏi các Users tương ứng trong `user_roles`.
 *   * Nếu truyền mảng rỗng, tất cả PositionRoles sẽ bị xóa và các bản ghi `user_roles` tương ứng cũng bị xóa.
 * - Tất cả cập nhật user và user_role được thực hiện trong cùng một giao dịch với cập nhật Position.
 *
 * Lưu ý (Caveat):
 * - Hiện tại không phân biệt được role được gán thủ công cho user hay role được sinh ra từ Position.
 *   Do đó, việc gỡ role khỏi Position sẽ xóa các role trùng khớp trên user. Nếu cần giữ lại các role
 *   gán thủ công, cân nhắc thêm cột `source` hoặc `assigned_via` vào bảng `user_roles`.
 *
 * @param {number} positionId - ID của chức vụ
 * @param {Object} updateData - Dữ liệu cập nhật (hỗ trợ thuộc tính `positionRoles` để đồng bộ PositionRoles)
 * @param {number} updatedBy - ID của người cập nhật
 * @returns {Object} { success, data, message }
 */
export const updatePositionService = async (positionId, updateData, updatedBy) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Extract roles from updateData
    const { positionRoles = [], ...positionData } = updateData;

    // Find position
    const position = await db.Position.findByPk(positionId, {
      transaction,
    });

    if (!position || position.is_deleted) {
      throw new Error(`Không tìm thấy chức vụ có ID ${positionId}`);
    }

    // Validate department if provided
    if (positionData.department_id && positionData.department_id !== position.department_id) {
      const department = await db.Department.findByPk(positionData.department_id, { transaction });

      if (!department) {
        throw new Error(`Không tìm thấy phòng ban có ID ${positionData.department_id}`);
      }
    }

    // Validate parent position if provided
    if (positionData.parent_position_id && positionData.parent_position_id !== position.parent_position_id) {
      // Check for circular reference
      if (positionData.parent_position_id === positionId) {
        throw new Error("Không thể đặt chức vụ là cha của chính nó");
      }

      const parentPosition = await db.Position.findByPk(positionData.parent_position_id, { transaction });

      if (!parentPosition || parentPosition.is_deleted) {
        throw new Error(`Không tìm thấy chức vụ cha có ID ${positionData.parent_position_id}`);
      }
    }

    // Check for duplicate name if name is being updated
    if (positionData.name && positionData.name !== position.name) {
      const departmentId = positionData.department_id || position.department_id;
      const duplicatePosition = await db.Position.findOne({
        where: {
          name: positionData.name,
          department_id: departmentId,
          id: { [Op.ne]: positionId },
          is_deleted: false,
        },
        transaction,
      });

      if (duplicatePosition) {
        throw new Error("Chức vụ với tên này đã tồn tại trong phòng ban này");
      }
    }

    // Update position
    await position.update(
      {
        ...positionData,
        updated_by: updatedBy,
      },
      { transaction }
    );

    // Phát hiện thay đổi phòng ban và truyền thay đổi này tới các user đang giữ chức vụ.
    // LƯU Ý: Việc cập nhật này được thực hiện trong cùng giao dịch với cập nhật Position, nên
    // nếu bước sau gặp lỗi thì cả cập nhật Position và cập nhật user sẽ bị rollback.
    const departmentChanged =
      positionData.department_id && positionData.department_id !== position.department_id;

    if (departmentChanged) {
      // Cập nhật `updated_by` trên bản ghi user để tiện tra cứu
      await db.User.update(
        { department_id: positionData.department_id, updated_by: updatedBy },
        { where: { position_id: positionId }, transaction }
      );
      logger.info(`Đã cập nhật phòng ban cho người dùng của chức vụ ${positionId} sang ${positionData.department_id}`);
    }

    // Handle roles if provided
    if (positionRoles && Array.isArray(positionRoles) && positionRoles.length > 0) {
      // Tải PositionRoles hiện tại để tính diff (vai trò nào bị thêm / bị gỡ)
      const currentRoles = await db.PositionRoles.findAll({
        where: { position_id: positionId },
        transaction,
      });

      const currentRoleIds = currentRoles.map((pr) => pr.role_id);

      // Tải danh sách người dùng giữ Position này. Chỉ lấy `id` để tiết kiệm tài nguyên.
      // Các userIds này sẽ được dùng để đồng bộ `user_roles` (gán vai trò mới / xóa vai trò cũ).
      const usersInPosition = await db.User.findAll({
        where: { position_id: positionId },
        attributes: ["id"],
        transaction,
      });
      const userIds = usersInPosition.map((u) => u.id);

      // Kiểm tra tất cả role được cung cấp tồn tại trước khi áp dụng thay đổi
      for (const roleId of positionRoles) {
        const role = await db.Role.findByPk(roleId, { transaction });
        if (!role) {
          throw new Error(`Không tìm thấy vai trò có ID ${roleId}`);
        }
      }

      // Tính hiệu (difference) giữa danh sách role hiện tại và danh sách mong muốn
      const rolesToRemove = currentRoleIds.filter((id) => !positionRoles.includes(id));
      const rolesToAdd = positionRoles.filter((id) => !currentRoleIds.includes(id));

      // Xóa PositionRoles không còn nằm trong danh sách mong muốn
      if (rolesToRemove.length > 0) {
        await db.PositionRoles.destroy({
          where: {
            position_id: positionId,
            role_id: { [Op.in]: rolesToRemove },
          },
          transaction,
        });

        // Đồng thời xóa các role này khỏi người dùng đang giữ vị trí
        // LƯU Ý: Hành động này sẽ xóa mọi bản ghi `user_roles` trùng khớp, bất kể được gán thủ công hay do Position.
        // Tham khảo phần Lưu ý (Caveat) trong JSDoc nếu cần thay đổi hành vi này.
        if (userIds.length > 0) {
          await db.UserRoles.destroy({
            where: {
              user_id: { [Op.in]: userIds },
              role_id: { [Op.in]: rolesToRemove },
            },
            transaction,
          });
          logger.info(`Đã gỡ vai trò [${rolesToRemove.join(", ")}] khỏi ${userIds.length} người dùng do cập nhật chức vụ ${positionId}`);
        }
      }

      // Add new PositionRoles
      if (rolesToAdd.length > 0) {
        const newRoles = rolesToAdd.map((roleId) => ({
          position_id: positionId,
          role_id: roleId,
          is_primary: positionRoles[0] === roleId, // First role is primary
          is_default: true,
          priority: positionRoles.indexOf(roleId),
        }));

        await db.PositionRoles.bulkCreate(newRoles, { transaction });

        // Gán các role mới này cho tất cả người dùng đang giữ vị trí
        // Sử dụng `ignoreDuplicates: true` để tránh lỗi khi người dùng đã có role tương ứng.
        if (userIds.length > 0) {
          const userRoleAssignments = [];
          for (const userId of userIds) {
            for (const roleId of rolesToAdd) {
              // `assigned_by` đặt thành updatedBy để tiện kiểm tra/ghi nhật ký
              userRoleAssignments.push({ user_id: userId, role_id: roleId, assigned_by: updatedBy });
            }
          }

          if (userRoleAssignments.length > 0) {
            await db.UserRoles.bulkCreate(userRoleAssignments, { ignoreDuplicates: true, transaction });
            logger.info(`Đã gán vai trò mới [${rolesToAdd.join(", ")}] cho ${userIds.length} người dùng của chức vụ ${positionId}`);
          }
        }
      }
    } else if (positionRoles && Array.isArray(positionRoles) && positionRoles.length === 0) {
      // Yêu cầu rõ ràng để xóa tất cả position roles: xóa PositionRoles và các user_roles tương ứng
      const existingRoles = await db.PositionRoles.findAll({ where: { position_id: positionId }, transaction });
      const existingRoleIds = existingRoles.map((r) => r.role_id);

      await db.PositionRoles.destroy({
        where: { position_id: positionId },
        transaction,
      });

      // Đồng thời xóa các role này khỏi người dùng đang giữ vị trí
      // LƯU Ý: Việc xóa này là rộng và sẽ xóa mọi bản ghi `user_roles` trùng khớp với các role này.
      const usersInPosition = await db.User.findAll({ where: { position_id: positionId }, attributes: ["id"], transaction });
      const userIds = usersInPosition.map((u) => u.id);

      if (existingRoleIds.length > 0 && userIds.length > 0) {
        await db.UserRoles.destroy({
          where: {
            user_id: { [Op.in]: userIds },
            role_id: { [Op.in]: existingRoleIds },
          },
          transaction,
        });
        logger.info(`Đã xóa tất cả (${existingRoleIds.length}) role của chức vụ khỏi ${userIds.length} người dùng vì chức vụ ${positionId} đã được dọn rỗng roles`);
      }
    }

    // Fetch updated position with roles
    const updatedPosition = await db.Position.findByPk(positionId, {
      include: [
        {
          association: "department",
          attributes: ["id", "name", "code"],
        },
        {
          association: "positionRoles",
          include: [
            {
              association: "role",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      transaction,
    });

    await transaction.commit();

    logger.info(`Position updated: ${positionId} by user ${updatedBy}`);

    return {
      success: true,
      data: updatedPosition,
      message: "Cập nhật chức vụ thành công",
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in updatePositionService:" + error.message);
    return {
      success: false,
      message: `Lỗi khi cập nhật chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Delete position (soft delete)
 *
 * @param {number} positionId - ID của chức vụ
 * @param {number} deletedBy - ID của người xóa
 * @returns {Object} { success, message }
 */
export const deletePositionService = async (positionId, deletedBy) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Find position
    const position = await db.Position.findByPk(positionId, {
      transaction,
    });

    if (!position || position.is_deleted) {
      throw new Error(`Không tìm thấy chức vụ có ID ${positionId}`);
    }

    // Check if position has users assigned
    const userCount = await db.User.count({
      where: { position_id: positionId },
      transaction,
    });

    if (userCount > 0) {
      throw new Error(`Không thể xóa chức vụ đang được gán cho ${userCount} nhân viên`);
    }

    // Check if position has child positions
    const childPositionCount = await db.Position.count({
      where: {
        parent_position_id: positionId,
        is_deleted: false,
      },
      transaction,
    });

    if (childPositionCount > 0) {
      throw new Error(`Không thể xóa chức vụ có ${childPositionCount} chức vụ con`);
    }

    // Soft delete
    await position.update(
      {
        is_deleted: true,
        updated_by: deletedBy,
      },
      { transaction }
    );

    await transaction.commit();

    logger.info(`Position deleted: ${positionId} by user ${deletedBy}`);

    return {
      success: true,
      message: "Xóa chức vụ thành công",
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in deletePositionService:", error.message);
    return {
      success: false,
      message: `Lỗi khi xóa chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Get positions by department
 *
 * @param {number} departmentId - ID của phòng ban
 * @param {Object} filters - Điều kiện lọc (level, status, etc.)
 * @returns {Object} { success, data, message, total }
 */
export const getPositionsByDepartmentService = async (departmentId, filters = {}) => {
  try {
    const { level, status = "active", includeRoles = false, includeInactive = false } = filters;

    // Check if department exists
    const department = await db.Department.findByPk(departmentId);

    if (!department) {
      return {
        success: false,
        message: `Không tìm thấy phòng ban có ID ${departmentId}`,
      };
    }

    // Build where clause
    const where = {
      department_id: departmentId,
      is_deleted: false,
    };

    if (level) {
      where.level = level;
    }

    if (!includeInactive && !status) {
      where.status = "active";
    } else if (status) {
      where.status = status;
    }

    // Build include
    const include = [];

    if (includeRoles) {
      include.push({
        association: "positionRoles",
        include: [
          {
            association: "role",
            attributes: ["id", "name"],
          },
        ],
      });
    }

    include.push({
      association: "parentPosition",
      attributes: ["id", "name", "code"],
      required: false,
    });

    include.push({
      association: "childPositions",
      attributes: ["id", "name", "code"],
      required: false,
    });

    const positions = await db.Position.findAll({
      where,
      include,
      order: [
        ["level", "ASC"],
        ["name", "ASC"],
      ],
    });

    if (!positions || positions.length === 0) {
      return {
        success: true,
        data: [],
        message: "Không có chức vụ nào trong phòng ban này",
        total: 0,
      };
    }

    return {
      success: true,
      data: positions,
      message: "Lấy danh sách chức vụ theo phòng ban thành công",
      total: positions.length,
    };
  } catch (error) {
    logger.error("Error in getPositionsByDepartmentService:", error.message);
    return {
      success: false,
      message: `Lỗi khi lấy danh sách chức vụ theo phòng ban: ${error.message}`,
    };
  }
};

/**
 * Service: Assign role to position
 *
 * Gán vai trò cho chức vụ
 *
 * @param {number} positionId - ID của chức vụ
 * @param {number} roleId - ID của vai trò
 * @param {boolean} isDefault - Có phải vai trò mặc định hay không
 * @param {number} assignedBy - ID của người gán
 * @returns {Object} { success, data, message }
 */
export const assignRoleToPositionService = async (positionId, roleId, isDefault = false, assignedBy) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Check if position exists
    const position = await db.Position.findByPk(positionId, {
      transaction,
    });

    if (!position || position.is_deleted) {
      throw new Error(`Không tìm thấy chức vụ có ID ${positionId}`);
    }

    // Check if role exists
    const role = await db.Role.findByPk(roleId, {
      transaction,
    });

    if (!role) {
      throw new Error(`Không tìm thấy vai trò có ID ${roleId}`);
    }

    // Check if role already assigned to position
    const existingAssignment = await db.PositionRoles.findOne({
      where: {
        position_id: positionId,
        role_id: roleId,
      },
      transaction,
    });

    if (existingAssignment) {
      throw new Error("Vai trò này đã được gán cho chức vụ rồi");
    }

    // Create assignment
    const positionRole = await db.PositionRoles.create(
      {
        position_id: positionId,
        role_id: roleId,
        is_default: isDefault,
        assigned_by: assignedBy,
      },
      { transaction }
    );

    // Fetch full data
    const assignment = await db.PositionRoles.findByPk(positionRole.id, {
      include: [
        {
          association: "position",
          attributes: ["id", "name", "code"],
        },
        {
          association: "role",
          attributes: ["id", "name"],
        },
      ],
      transaction,
    });

    await transaction.commit();

    logger.info(`Role ${roleId} assigned to position ${positionId} by user ${assignedBy}`);

    return {
      success: true,
      data: assignment,
      message: "Gán vai trò cho chức vụ thành công",
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in assignRoleToPositionService:", error.message);
    return {
      success: false,
      message: `Lỗi khi gán vai trò cho chức vụ: ${error.message}`,
    };
  }
};

/**
 * Service: Remove role from position
 *
 * Gỡ vai trò khỏi chức vụ
 *
 * @param {number} positionId - ID của chức vụ
 * @param {number} roleId - ID của vai trò
 * @param {number} removedBy - ID của người gỡ
 * @returns {Object} { success, message }
 */
export const removeRoleFromPositionService = async (positionId, roleId, removedBy) => {
  const transaction = await db.sequelize.transaction();

  try {
    // Check if position exists
    const position = await db.Position.findByPk(positionId, {
      transaction,
    });

    if (!position || position.is_deleted) {
      throw new Error(`Không tìm thấy chức vụ có ID ${positionId}`);
    }

    // Check if assignment exists
    const assignment = await db.PositionRoles.findOne({
      where: {
        position_id: positionId,
        role_id: roleId,
      },
      transaction,
    });

    if (!assignment) {
      throw new Error("Vai trò này không được gán cho chức vụ");
    }

    // Delete assignment
    await assignment.destroy({ transaction });

    await transaction.commit();

    logger.info(`Role ${roleId} removed from position ${positionId} by user ${removedBy}`);

    return {
      success: true,
      message: "Gỡ vai trò khỏi chức vụ thành công",
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in removeRoleFromPositionService:", error.message);
    return {
      success: false,
      message: `Lỗi khi gỡ vai trò khỏi chức vụ: ${error.message}`,
    };
  }
};
