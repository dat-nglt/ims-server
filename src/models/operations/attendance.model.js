"use strict";

/**
 * Model Attendance (Chấm công)
 *
 * Lưu trữ thông tin check-in/check-out:
 * - Vị trí GPS (latitude, longitude)
 * - Ảnh chứng minh
 * - Thời gian làm việc
 * - Kiểm tra phạm vi
 * - Loại chấm công
 * - Liên kết dự án (optional)
 * - Khoảng cách vi phạm
 * - Trạng thái enum
 * - Danh sách technicians (IDs)
 */
export default (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
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
          model: "users",
          key: "id",
        },
      },
      // ID công việc (FK)
      work_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "works",
          key: "id",
        },
      },
      // ID dự án (FK, mới: để hỗ trợ lọc theo dự án trong TrackAttendance, optional vì công việc có thể không thuộc dự án)
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional để hỗ trợ công việc không liên kết dự án
        references: {
          model: "projects",
          key: "id",
        },
      },

      // Attendance session liên kết tới bảng `attendance_sessions`
      // (một phiên = 1 kỹ thuật + 1 công việc; dùng để truy xuất check-in/out rõ ràng)
      attendance_session_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_sessions",
          key: "id",
        },
      },

      // Thời gian check-in
      check_in_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Thời gian check-out
      check_out_time: {
        type: DataTypes.DATE,
      },
      // Thời gian check-in theo múi giờ địa phương (không chuyển đổi UTC)
      check_in_time_on_local: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Thời gian check-out theo múi giờ địa phương (không chuyển đổi UTC)
      check_out_time_on_local: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Vĩ độ check-in với validation (-90 to 90)
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Kinh độ check-in với validation (-180 to 180)
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
          notNull: true,
        },
      },
      // Vĩ độ check-out với validation (-90 to 90)
      latitude_check_out: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
        },
      },
      // Kinh độ check-out với validation (-180 to 180)
      longitude_check_out: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
        },
      },
      // Tên địa điểm
      location_name: {
        type: DataTypes.STRING(255),
      },
      location_name_check_out: {
        type: DataTypes.STRING(255),
      },
      // Địa chỉ đầy đủ
      address: {
        type: DataTypes.TEXT,
      },
      // URL ảnh (legacy)
      photo_url: {
        type: DataTypes.TEXT,
      },
      // URL ảnh check-out (chứng minh chấm công ra)
      photo_url_check_out: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Địa chỉ check-out
      address_check_out: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // Trạng thái (cập nhật: enum để hỗ trợ 'on_leave' từ TrackAttendance)
      status: {
        type: DataTypes.ENUM("checked_in", "checked_out", "on_leave"),
        defaultValue: "checked_in",
      },
      // Khoảng cách từ công việc với validation
      distance_from_work: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      // Có trong phạm vi hay không
      is_within_radius: {
        type: DataTypes.BOOLEAN,
      },
      // Khoảng cách từ công việc khi check-out
      distance_from_work_check_out: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      // Có trong phạm vi hay không khi check-out
      is_within_radius_check_out: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      // Thông tin thiết bị
      device_info: {
        type: DataTypes.TEXT,
      },
      // IP address
      ip_address: {
        type: DataTypes.STRING(45),
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
      },
      // Metadata (JSON) - used for hub info and other metadata
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      // Loại chấm công (FK tới attendance_type)
      attendance_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_type",
          key: "id",
        },
      },
      // Khoảng cách vi phạm (từ violationDistance trong CheckIn.jsx)
      violation_distance: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
      },

      violation_distance_check_out: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
      },
      // Bản ghi chấm công hợp lệ về mặt thời gian (null = chưa đánh giá, true/false = đã đánh giá)
      is_valid_time_check_in: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      is_valid_time_check_out: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },

      // Xử lý hoàn thành sớm (kỹ thuật viên hoàn thành việc sớm hơn giờ checkout)
      // Đánh dấu nếu công việc được hoàn thành trước khi checkout chính thức
      early_completion_flag: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      // Thời gian kỹ thuật viên báo hoàn thành công việc
      early_completion_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Ghi chú của kỹ thuật viên về lý do hoàn thành sớm
      early_completion_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Trạng thái xét duyệt hoàn thành sớm (null = chưa xét duyệt, true = duyệt, false = từ chối)
      early_completion_reviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      // ID người xét duyệt (FK tới users)
      early_completion_reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      // Thời gian xét duyệt
      early_completion_review_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Ghi chú xét duyệt từ người quản lý
      early_completion_review_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "attendance",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["work_id"] },
        { fields: ["check_in_time"] },
        { fields: ["status"] },
        { fields: ["is_valid_time_check_in"] },
        { fields: ["is_valid_time_check_out"] },
        { fields: ["early_completion_flag"] },
        { fields: ["early_completion_reviewed"] },
        { fields: ["user_id", "check_in_time"] }, // Composite index cho truy vấn theo user và thời gian
        { fields: ["project_id"] }, // Index mới cho lọc theo dự án
        { fields: ["attendance_session_id"] }, // Index để truy xuất theo phiên chấm công
        { fields: ["attendance_type_id"] }, // Index cho lọc theo loại chấm công
        { fields: ["early_completion_reviewer_id"] }, // Index cho truy xuất theo người xét duyệt
        { fields: ["project_id", "check_in_time"] }, // Composite for project-date queries
        { fields: ["work_id", "check_in_time"] }, // Composite for work-date queries
      ],
      hooks: {
        // Hook: set status from check_out_time
        beforeSave: async (checkIn, options) => {
          // Set status automatically
          if (checkIn.check_out_time) {
            checkIn.status = "checked_out";
          } else if (checkIn.status === "checked_out" && !checkIn.check_out_time) {
            checkIn.status = "checked_in";
          }
        },

        // Create or link an AttendanceSession when creating a check-in
        beforeCreate: async (checkIn, options) => {
          const AttendanceSession = checkIn.sequelize.models.AttendanceSession;
          if (!AttendanceSession) return;

          // If this check-in already belongs to a session, skip
          if (checkIn.attendance_session_id) return;

          // If check_out_time exists we create a closed session, otherwise try to find or create an open session
          // Helper: if work_id indicates a hub (warehouse/office), do not set FK on session.work_id
          const HUB_WORK_IDS = [-1, -2];
          const isHub = checkIn.work_id === null || HUB_WORK_IDS.includes(checkIn.work_id);
          const sessionWorkId = isHub ? null : checkIn.work_id;
          const sessionMetadata = isHub ? { hub: checkIn.work_id === -1 ? "warehouse" : "office" } : {};

          if (checkIn.check_out_time) {
            const session = await AttendanceSession.create(
              {
                user_id: checkIn.user_id,
                work_id: sessionWorkId,
                project_id: checkIn.project_id,
                attendance_type_id: checkIn.attendance_type_id,
                started_at: checkIn.check_in_time || null,
                ended_at: checkIn.check_out_time,
                status: "closed",
                latitude: checkIn.latitude,
                longitude: checkIn.longitude,
                metadata: sessionMetadata,
              },
              { transaction: options.transaction }
            );

            checkIn.attendance_session_id = session.id;
          } else {
            const [session] = await AttendanceSession.findOrCreate({
              where: {
                user_id: checkIn.user_id,
                work_id: sessionWorkId,
                ended_at: null,
              },
              defaults: {
                user_id: checkIn.user_id,
                work_id: sessionWorkId,
                project_id: checkIn.project_id,
                attendance_type_id: checkIn.attendance_type_id,
                started_at: checkIn.check_in_time || new Date(),
                status: "open",
                latitude: checkIn.latitude,
                longitude: checkIn.longitude,
                metadata: sessionMetadata,
              },
              transaction: options.transaction,
            });

            checkIn.attendance_session_id = session.id;
          }
        },

        // After creating record, ensure session references the check-in/check-out ids properly
        afterCreate: async (checkIn, options) => {
          const AttendanceSession = checkIn.sequelize.models.AttendanceSession;
          if (!AttendanceSession || !checkIn.attendance_session_id) return;

          try {
            const session = await AttendanceSession.findByPk(checkIn.attendance_session_id, {
              transaction: options.transaction,
            });
            if (!session) return;

            // Make sure the session has check_in_id set for the first check-in
            if (!session.check_in_id) {
              await session.update({ check_in_id: checkIn.id }, { transaction: options.transaction });
            }

            // If this record includes a check_out, close the session and set check_out_id
            if (checkIn.check_out_time) {
              await session.update(
                {
                  ended_at: checkIn.check_out_time,
                  status: "closed",
                  check_out_id: checkIn.id,
                  attendance_type_id: checkIn.attendance_type_id,
                },
                { transaction: options.transaction }
              );
            }
          } catch (err) {
            console.error("Error updating AttendanceSession in afterCreate:", err);
            // Rollback will be handled by transaction
            throw err;
          }
        },

        // On update, if record gets a check_out_time, close the related session
        afterUpdate: async (checkIn, options) => {
          const AttendanceSession = checkIn.sequelize.models.AttendanceSession;
          if (!AttendanceSession) return;

          try {
            // If attendance_session_id exists, update it
            if (checkIn.attendance_session_id && checkIn.check_out_time) {
              await AttendanceSession.update(
                {
                  ended_at: checkIn.check_out_time,
                  status: "closed",
                  check_out_id: checkIn.id,
                  attendance_type_id: checkIn.attendance_type_id,
                  latitude: checkIn.latitude,
                  longitude: checkIn.longitude,
                },
                { where: { id: checkIn.attendance_session_id }, transaction: options.transaction }
              );
              return;
            }

            // Otherwise, try to find an open session for this user/work and close it
            if (checkIn.check_out_time) {
              const session = await AttendanceSession.findOne({
                where: { user_id: checkIn.user_id, work_id: checkIn.work_id, ended_at: null },
                transaction: options.transaction,
              });
              if (session) {
                await session.update(
                  {
                    ended_at: checkIn.check_out_time,
                    status: "closed",
                    check_out_id: checkIn.id,
                    attendance_type_id: checkIn.attendance_type_id,
                    latitude: checkIn.latitude,
                    longitude: checkIn.longitude,
                  },
                  { transaction: options.transaction }
                );
                // also link the check-in to the session if not already linked
                if (!checkIn.attendance_session_id) {
                  await checkIn.update({ attendance_session_id: session.id }, { transaction: options.transaction });
                }
              }
            }
          } catch (err) {
            console.error("Error updating AttendanceSession in afterUpdate:", err);
            // Rollback will be handled by transaction
            throw err;
          }
        },
      },
    }
  );

  // Định nghĩa các mối quan hệ
  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Attendance.belongsTo(models.Work, {
      foreignKey: "work_id",
      as: "work",
    });

    Attendance.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });

    Attendance.belongsTo(models.AttendanceType, {
      foreignKey: "attendance_type_id",
      as: "attendanceType",
    });

    // Liên kết tới attendance session
    Attendance.belongsTo(models.AttendanceSession, {
      foreignKey: "attendance_session_id",
      as: "attendanceSession",
    });

    // Liên kết tới người xét duyệt hoàn thành sớm
    Attendance.belongsTo(models.User, {
      foreignKey: "early_completion_reviewer_id",
      as: "earlyCompletionReviewer",
    });
  };

  return Attendance;
};
