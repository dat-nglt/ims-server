'use strict';

/**
 * Model Role (Vai trò)
 * 
 * Lưu trữ các vai trò trong hệ thống
 */
export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên vai trò với validation
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
        comment: 'Tên vai trò: admin, manager, sales, technician',
      },
      // Mô tả vai trò với validation
      description: {
        type: DataTypes.TEXT,
        validate: {
          len: [0, 500], // Giới hạn độ dài
        },
        comment: 'Mô tả chi tiết về vai trò',
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
      tableName: 'roles',
      timestamps: false,
      indexes: [
        { fields: ['name'] },
        { fields: ['created_at'] }, // Thêm index cho created_at nếu cần truy vấn theo thời gian
      ],
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'role_id',
      as: 'users',
    });
  };

  return Role;
};
