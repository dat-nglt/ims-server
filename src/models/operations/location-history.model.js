'use strict';

/**
 * Model LocationHistory (Lịch sử vị trí)
 * 
 * Lưu trữ lịch sử vị trí GPS của kỹ thuật viên để theo dõi real-time và bản đồ
 */
export default (sequelize, DataTypes) => {
  const LocationHistory = sequelize.define(
    'LocationHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // ID người dùng (FK)
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // Vĩ độ
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Kinh độ
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      // Độ chính xác GPS
      accuracy: {
        type: DataTypes.DECIMAL(10, 2),
      },
      // Trạng thái (working, idle, break, offline)
      status: {
        type: DataTypes.ENUM('working', 'idle', 'break', 'offline'),
        defaultValue: 'idle',
      },
      // Timestamp
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // Thông tin thiết bị
      device_info: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'location_histories',
      timestamps: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['timestamp'] },
        { fields: ['status'] },
        { fields: ['user_id', 'timestamp'] }, // Composite index cho truy vấn theo user và thời gian
      ],
    }
  );

  // Định nghĩa các mối quan hệ
  LocationHistory.associate = (models) => {
    LocationHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return LocationHistory;
};
