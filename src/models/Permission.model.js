'use strict';

/**
 * Model Permission (Quyền hạn)
 * 
 * Lưu trữ các quyền hạn có sẵn trong hệ thống
 */
export default (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên quyền hạn
      name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        comment: 'Tên quyền hạn: edit_work, approve_report...',
      },
      // Mô tả quyền hạn
      description: {
        type: DataTypes.TEXT,
        comment: 'Mô tả chi tiết về quyền hạn',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'permissions',
      timestamps: false,
      indexes: [{ fields: ['name'] }],
    }
  );

  Permission.associate = (models) => {
    Permission.hasMany(models.UserRolePermission, {
      foreignKey: 'permission_id',
      as: 'userRolePermissions',
    });
  };

  return Permission;
};
