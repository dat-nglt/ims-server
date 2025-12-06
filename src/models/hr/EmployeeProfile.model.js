'use strict';

/**
 * Model EmployeeProfile (Hồ sơ nhân viên)
 * 
 * Lưu trữ thông tin chi tiết về nhân viên
 */
export default (sequelize, DataTypes) => {
  const EmployeeProfile = sequelize.define(
    'EmployeeProfile',
    {
      id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
      },
      // ID người dùng (FK)
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Người dùng',
      },
      // Phòng ban
      department: {
        type: DataTypes.STRING(100),
        comment: 'Phòng ban',
      },
      // Chuyên môn - lưu dưới dạng JSON thay vì ARRAY
      specialization: {
        type: DataTypes.JSONB,
        comment: 'Danh sách chuyên môn (JSON)',
      },
      // Chứng chỉ - lưu dưới dạng JSON thay vì ARRAY
      certification: {
        type: DataTypes.JSONB,
        comment: 'Danh sách chứng chỉ (JSON)',
      },
      // Số điện thoại phụ
      phone_secondary: {
        type: DataTypes.STRING(20),
        comment: 'Số điện thoại liên lạc thứ 2',
      },
      // Địa chỉ
      address: {
        type: DataTypes.TEXT,
        comment: 'Địa chỉ cư trú',
      },
      // Ngày sinh
      date_of_birth: {
        type: DataTypes.DATE,
        comment: 'Ngày sinh',
      },
      // Giới tính
      gender: {
        type: DataTypes.STRING(10),
        comment: 'Giới tính: M/F',
      },
      // Số CMND/CCCD
      id_number: {
        type: DataTypes.STRING(50),
        comment: 'Số chứng minh thư/CCCD',
      },
      // Ngày vào làm
      hire_date: {
        type: DataTypes.DATE,
        comment: 'Ngày bắt đầu làm việc',
      },
      // Tổng kinh nghiệm
      total_experience_years: {
        type: DataTypes.INTEGER,
        comment: 'Tổng năm kinh nghiệm',
      },
      // Đánh giá hiệu suất
      performance_rating: {
        type: DataTypes.DECIMAL(3, 2),
        comment: 'Đánh giá hiệu suất (1-5)',
      },
      // Lương theo ngày
      dailySalary: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 500000.00,
        comment: 'Lương theo ngày (VND)',
      },
      // Trạng thái hoạt động (for soft delete)
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Hồ sơ có hoạt động hay không',
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
      tableName: 'employee_profiles',
      timestamps: false,
      indexes: [{ fields: ['user_id'] }, { fields: ['is_active'] }],
    }
  );

  EmployeeProfile.associate = (models) => {
    EmployeeProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return EmployeeProfile;
};
