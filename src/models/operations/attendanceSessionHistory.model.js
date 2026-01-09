
'use strict';

/**
 * Model AttendanceSessionHistory
 * 
 * Lưu lại lịch sử của các phiên chấm công đã kết thúc (được sao lưu trước khi xóa khỏi `attendance_sessions`)
 */
export default (sequelize, DataTypes) => {
  const AttendanceSessionHistory = sequelize.define(
    'AttendanceSessionHistory',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      original_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      work_id: {
        type: DataTypes.INTEGER,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      started_at: {
        type: DataTypes.DATE,
      },
      ended_at: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING(20),
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
      },
      check_in_id: {
        type: DataTypes.INTEGER,
      },
      check_out_id: {
        type: DataTypes.INTEGER,
      },
      attendance_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // Danh sách user IDs tham gia phiên (primary + co-technicians)
      attendee_user_ids: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      notes: {
        type: DataTypes.TEXT,
      },
      archived_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      archived_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
    },
    {
      tableName: 'attendance_session_histories',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['original_id'] },
        { fields: ['user_id'] },
        { fields: ['work_id'] },
        { fields: ['project_id'] },
        { fields: ['archived_at'] },
        { fields: ['attendance_type_id'] },
      ],
    }
  );

  AttendanceSessionHistory.associate = (models) => {
    AttendanceSessionHistory.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    AttendanceSessionHistory.belongsTo(models.Work, { foreignKey: 'work_id', as: 'work' });
    AttendanceSessionHistory.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
  };

  return AttendanceSessionHistory;
};
