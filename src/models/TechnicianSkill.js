'use strict';

/**
 * Model TechnicianSkill (Cấp bậc kỹ thuật viên)
 * 
 * Lưu trữ cấp bậc của từng kỹ thuật viên: Kỹ thuật chính, Kỹ thuật phụ, Kỹ thuật viên thực tập
 */
export default (sequelize, DataTypes) => {
  const TechnicianSkill = sequelize.define(
    'TechnicianSkill',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID kỹ thuật viên
      technician_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Cấp bậc kỹ thuật viên với validation
      technician_level: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isIn: [['Kỹ thuật chính', 'Kỹ thuật phụ', 'Kỹ thuật viên thực tập']],
        },
        comment: 'Cấp bậc: Kỹ thuật chính, Kỹ thuật phụ, Kỹ thuật viên thực tập',
      },
      // Ngày phân công cấp bậc
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày phân công cấp bậc',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'technician_skills',
      timestamps: false,
      indexes: [
        { fields: ['technician_id'] },
        { fields: ['technician_level'] },
      ],
      uniqueKeys: {
        unique_technician_level: {
          fields: ['technician_id', 'technician_level'],
        },
      },
    }
  );

  TechnicianSkill.associate = (models) => {
    TechnicianSkill.belongsTo(models.User, {
      foreignKey: 'technician_id',
      as: 'technician',
    });
  };

  return TechnicianSkill;
};
