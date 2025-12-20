'use strict';

/**
 * Model Project (Dự án)
 *
 * Bảng lưu trữ thông tin dự án:
 * - Thông tin cơ bản: tên, mô tả, trạng thái, ưu tiên
 * - Thời gian: bắt đầu, kết thúc, tạo, cập nhật
 * - Quản lý: người quản lý, người tạo
 * - Tài chính: ngân sách, chi tiêu
 * - Tiến độ: phần trăm hoàn thành
 * - Công việc: tổng số, hoàn thành, quá hạn, báo cáo chờ
 * - Nhóm: danh sách thành viên (qua quan hệ many-to-many)
 */
export default (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Tên dự án
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tên dự án',
      },
      // Mô tả dự án
      description: {
        type: DataTypes.TEXT,
        comment: 'Mô tả chi tiết dự án',
      },
      // Trạng thái dự án
      status: {
        type: DataTypes.ENUM('active', 'in_progress', 'completed', 'on_hold', 'cancelled'),
        defaultValue: 'active',
      },
      // Mức độ ưu tiên
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
      },
      // Tiến độ hoàn thành (%)
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
        comment: 'Phần trăm tiến độ hoàn thành (0-100)',
      },
      // Ngày bắt đầu
      start_date: {
        type: DataTypes.DATE,
        comment: 'Ngày bắt đầu dự án',
      },
      // Ngày kết thúc
      end_date: {
        type: DataTypes.DATE,
        comment: 'Ngày kết thúc dự án',
      },
      // Người quản lý (FK)
      manager_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người quản lý dự án',
      },
      // Ngân sách
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Ngân sách dự án',
      },
      // Chi tiêu thực tế
      spent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Số tiền đã chi tiêu',
      },
      // Tổng số công việc (snake_case)
      total_tasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Tổng số công việc trong dự án',
      },
      // Số công việc hoàn thành
      completed_tasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Số công việc đã hoàn thành',
      },
      // Số công việc quá hạn
      overdue_tasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Số công việc quá hạn',
      },
      // Số báo cáo chờ xử lý
      pending_reports: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Số báo cáo đang chờ xử lý',
      },
      // Planned manpower (person-days)
      planned_manpower: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Planned manpower (person-days)',
      },
      // Consumed manpower (person-days)
      consumed_manpower: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Consumed manpower (person-days)',
      },
      // Timeline (array of objects) - JSONB
      timeline: {
        type: DataTypes.JSONB,
        comment: 'Timeline points e.g. [{month, progress, completed, manpower}]',
      },
      // Budget breakdown
      budget_details: {
        type: DataTypes.JSONB,
        comment: 'Budget breakdown by category: [{category, allocated, spent}]',
      },
      // Người tạo (FK)
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'ID người tạo dự án',
      },
    },
    {
      tableName: 'projects',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['name'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['start_date'] },
        { fields: ['end_date'] },
        { fields: ['manager_id'] },
        { fields: ['created_by'] },
        { fields: ['total_tasks'] },
        { fields: ['completed_tasks'] },
        { fields: ['overdue_tasks'] },
        { fields: ['pending_reports'] },
        { fields: ['planned_manpower'] },
        { fields: ['consumed_manpower'] },
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  Project.associate = (models) => {
    // Người quản lý
    Project.belongsTo(models.User, {
      foreignKey: 'manager_id',
      as: 'manager',
    });

    // Người tạo
    Project.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    // Một dự án có nhiều công việc
    Project.hasMany(models.Work, {
      foreignKey: 'project_id',
      as: 'works',
    });

    // Một dự án có nhiều báo cáo
    Project.hasMany(models.WorkReport, {
      foreignKey: 'project_id',
      as: 'reports',
    });

    // Một dự án có nhiều thông báo
    Project.hasMany(models.Notification, {
      foreignKey: 'related_project_id',
      as: 'notifications',
    });

    // Danh sách thành viên dự án (chi tiết) - normalized table
    Project.hasMany(models.ProjectTeamMember, {
      foreignKey: 'project_id',
      as: 'teamMembers',
    });

    // Một dự án có nhiều thành viên (many-to-many với User qua bảng project_members)
    Project.belongsToMany(models.User, {
      through: 'project_members', // Giả sử bảng junction là project_members
      foreignKey: 'project_id',
      otherKey: 'user_id',
      as: 'team', // Để khớp với frontend: team: Array<string> (các tên user)
    });
  };

  return Project;
};