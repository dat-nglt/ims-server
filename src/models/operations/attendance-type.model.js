"use strict";

/**
 * Model AttendanceType (Loại chấm công)
 *
 * Các trường:
 * - id

 * - name (string)
 * - default_duration_minutes (integer, optional)
 * - description (text)
 * - active (boolean)
 */
export default (sequelize, DataTypes) => {
  const AttendanceType = sequelize.define(
    "AttendanceType",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "Mã loại chấm công",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Tên loại chấm công",
      },
      default_duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
        comment: "Thời lượng mặc định (phút) cho loại này",
      },
      // Giờ bắt đầu cho loại chấm công (HH:MM:SS)
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "Giờ bắt đầu (HH:MM:SS)",
      },
      // Giờ kết thúc cho loại chấm công (HH:MM:SS)
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
        comment: "Giờ kết thúc (HH:MM:SS)",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: "attendance_type",
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ["code"] }, { fields: ["name"] }, { fields: ["active"] }],
      hooks: {
        // Compute default_duration_minutes from start_time/end_time when not provided
        beforeSave: (instance) => {
          try {
            const s = instance.start_time;
            const e = instance.end_time;
            if (s && e && (instance.default_duration_minutes == null || instance.default_duration_minutes === 0)) {
              // parse HH:MM(:SS)
              const parseMin = (t) => {
                const parts = String(t)
                  .split(":")
                  .map((p) => parseInt(p, 10) || 0);
                const hh = parts[0] || 0;
                const mm = parts[1] || 0;
                return hh * 60 + mm;
              };
              let startMin = parseMin(s);
              let endMin = parseMin(e);

              // handle crossing midnight
              let diff = endMin - startMin;
              if (diff < 0) diff += 24 * 60;

              instance.default_duration_minutes = Math.max(0, diff);
            }
          } catch (err) {
            // ignore calculation errors
          }
        },
      },
    }
  );

  AttendanceType.associate = (models) => {
    // optional: will be referenced by CheckIn
    AttendanceType.hasMany(models.Attendance, {
      foreignKey: "check_in_type_id",
      as: "attendance",
    });
  };

  return AttendanceType;
};
