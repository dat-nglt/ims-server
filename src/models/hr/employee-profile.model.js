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
      // Use user_id as primary key to enforce strict 1:1 with users
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
      // Ngày ký hợp đồng
      contract_date: {
        type: DataTypes.DATE,
        comment: 'Ngày ký hợp đồng',
      },
      // Số tài khoản ngân hàng
      bank_account_number: {
        type: DataTypes.STRING(50),
        comment: 'Số tài khoản ngân hàng',
      },
      // Tên ngân hàng (mặc định ACB)
      bank_name: {
        type: DataTypes.STRING(100),
        defaultValue: 'ACB',
        comment: 'Tên ngân hàng',
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
      // Lương theo ngày (camelCase accessor for API stability)
      dailySalary: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 500000.00,
        comment: 'Lương theo ngày (VND)',
        field: 'daily_salary',
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
      foreignKey: { name: 'user_id', allowNull: false },
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return EmployeeProfile;
};
