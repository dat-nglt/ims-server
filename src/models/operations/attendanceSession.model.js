"use strict";

/**
 * Model AttendanceSession
 *
 * Lưu trữ phiên chấm công cho 1 kỹ thuật trên 1 công việc (một phiên = một cặp check-in/out)
 */
import { Op } from "sequelize";

export default (sequelize, DataTypes) => {
  const AttendanceSession = sequelize.define(
    "AttendanceSession",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      work_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "works",
          key: "id",
        },
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "projects",
          key: "id",
        },
      },
      started_at: {
        type: DataTypes.DATE,
      },
      ended_at: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("open", "closed"),
        defaultValue: "open",
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      // Optional references to the first/last attendance records
      check_in_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "attendance",
          key: "id",
        },
      },
      check_out_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "attendance",
          key: "id",
        },
      },
      attendance_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_type",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.TEXT,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      // ID địa điểm chấm công - cho khối văn phòng (optional, thay thế work_id)
      office_location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_locations",
          key: "id",
        },
      },
      // ID địa điểm check-out (cho trường hợp công tác)
      office_location_id_check_out: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "attendance_locations",
          key: "id",
        },
      },
    },
    {
      tableName: "attendance_sessions",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["user_id"] },
        { fields: ["work_id"] },
        { fields: ["started_at"] },
        { fields: ["ended_at"] },
        { fields: ["status"] },
        { fields: ["attendance_type_id"] },
        { fields: ["office_location_id"] }, // Index cho office session
        { fields: ["office_location_id_check_out"] }, // Index cho office check-out session
      ],
      hooks: {
        beforeSave: (session) => {
          if (session.started_at && session.ended_at) {
            const durationMs = new Date(session.ended_at) - new Date(session.started_at);
            session.duration_minutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));
          }

          if (session.ended_at) {
            session.status = "closed";
          } else {
            session.status = "open";
          }
        },

        // Logic check-in: Khi tạo session
        // - Nếu session open đã tồn tại → báo lỗi (không được phép check-in)
        // - Nếu không → tạo session mới và ghi nhận lịch sử
        // Lưu ý: Session sẽ dùng chung cho primary technician + co-technicians
        beforeCreate: async (session, options) => {
          // Kiểm tra xem đã có session open cho user/work hoặc user/office_location không
          const where = {
            user_id: session.user_id,
            attendance_type_id: session.attendance_type_id,
            ended_at: null,
            status: "open",
          };

          // Nếu là work_id (kỹ thuật)
          if (session.work_id) {
            where.work_id = session.work_id;
          }
          // Nếu là office_location_id (văn phòng)
          else if (session.office_location_id) {
            where.office_location_id = session.office_location_id;
          }

          const existingSession = await session.constructor.findOne({
            where,
            transaction: options.transaction,
          });

          if (existingSession) {
            const location = session.work_id ? "công việc" : "văn phòng";
            throw new Error(
              `Không thể chấm công: Người dùng ${session.user_id} đã chấm công vào ${location} lúc ${session.started_at}. Session ID: ${existingSession.id}`
            );
          }
        },

        // Khi session được tạo: ghi nhận lịch sử
        afterCreate: async (session, options) => {
          const AttendanceSessionHistory = session.sequelize.models.AttendanceSessionHistory;
          if (!AttendanceSessionHistory) return;

          // Ghi nhận lịch sử check-in
          await AttendanceSessionHistory.create(
            {
              original_id: session.id,
              user_id: session.user_id,
              work_id: session.work_id,
              project_id: session.project_id,
              started_at: session.started_at,
              ended_at: session.ended_at,
              status: session.status,
              attendance_type_id: session.attendance_type_id,
              duration_minutes: session.duration_minutes,
              check_in_id: session.check_in_id,
              check_out_id: session.check_out_id,
              attendee_user_ids: [session.user_id], // Bắt đầu với primary user
              notes: session.notes,
              latitude: session.latitude,
              longitude: session.longitude,
              archived_at: new Date(),
              archived_by: options && options.userId ? options.userId : null,
            },
            { transaction: options.transaction }
          );
        },

        // Logic check-out: Khi session chuyển sang 'closed'
        // - Ghi nhận lịch sử
        // - Ghi nhận check-out vào bảng attendance (cả primary + co-technicians)
        // - Xóa session
        afterUpdate: async (session, options) => {
          try {
            const prevStatus = session._previousDataValues && session._previousDataValues.status;

            // Nếu chuyển từ open sang closed → check-out
            if (session.status === "closed" && prevStatus === "open") {
              const AttendanceSessionHistory = session.sequelize.models.AttendanceSessionHistory;
              const Attendance = session.sequelize.models.Attendance;

              if (AttendanceSessionHistory) {
                // Lấy danh sách tất cả users tham gia session (primary + co-technicians)
                const attendanceRecords = await Attendance.findAll({
                  where: { attendance_session_id: session.id },
                  attributes: ["user_id"],
                  raw: true,
                  transaction: options.transaction,
                });

                const attendeeUserIds = [...new Set(attendanceRecords.map((r) => r.user_id))]; // Remove duplicates

                // Ghi nhận lịch sử check-out
                const data = {
                  original_id: session.id,
                  user_id: session.user_id,
                  work_id: session.work_id,
                  project_id: session.project_id,
                  started_at: session.started_at,
                  ended_at: session.ended_at,
                  attendance_type_id: session.attendance_type_id,
                  status: session.status,
                  duration_minutes: session.duration_minutes,
                  check_in_id: session.check_in_id,
                  check_out_id: session.check_out_id,
                  attendee_user_ids: attendeeUserIds, // Ghi nhận tất cả attendees
                  notes: session.notes,
                  latitude: session.latitude,
                  longitude: session.longitude,
                  archived_at: new Date(),
                  archived_by: options && options.userId ? options.userId : null,
                };

                await AttendanceSessionHistory.create(data, { transaction: options.transaction });
              }

              // Cập nhật tất cả attendance records liên kết với session này (primary + co-technicians)
              if (session.check_out_id && Attendance) {
                // Cập nhật primary attendance record
                await Attendance.update(
                  { status: "checked_out", check_out_time: session.ended_at },
                  {
                    where: { id: session.check_out_id },
                    transaction: options.transaction,
                  }
                );

                // Tìm và cập nhật tất cả co-technician records
                // Co-technician records có parent_attendance_id != null
                const coTechnicianRecords = await Attendance.findAll({
                  where: {
                    attendance_session_id: session.id,
                    parent_attendance_id: { [Op.not]: null },
                  },
                  transaction: options.transaction,
                });

                for (const coRecord of coTechnicianRecords) {
                  await coRecord.update(
                    { status: "checked_out", check_out_time: session.ended_at },
                    { transaction: options.transaction }
                  );
                }
              }

              // Xóa phiên trong cùng transaction
              await session.destroy({ transaction: options.transaction, force: true });
            }
          } catch (err) {
            throw err;
          }
        },

        // Nếu xóa trực tiếp: ghi nhận lịch sử trước khi xóa
        beforeDestroy: async (session, options) => {
          const AttendanceSessionHistory = session.sequelize.models.AttendanceSessionHistory;
          if (!AttendanceSessionHistory) return;

          const exists = await AttendanceSessionHistory.findOne({
            where: { original_id: session.id },
            transaction: options.transaction,
          });
          if (!exists) {
            await AttendanceSessionHistory.create(
              {
                original_id: session.id,
                user_id: session.user_id,
                work_id: session.work_id,
                project_id: session.project_id,
                started_at: session.started_at,
                ended_at: session.ended_at,
                status: session.status,
                duration_minutes: session.duration_minutes,
                check_in_id: session.check_in_id,
                check_out_id: session.check_out_id,
                notes: session.notes,
                latitude: session.latitude,
                longitude: session.longitude,
                archived_at: new Date(),
                archived_by: options && options.userId ? options.userId : null,
              },
              { transaction: options.transaction }
            );
          }
        },
      },
    }
  );

  AttendanceSession.associate = (models) => {
    AttendanceSession.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    AttendanceSession.belongsTo(models.Work, {
      foreignKey: "work_id",
      as: "work",
    });

    AttendanceSession.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });

    AttendanceSession.belongsTo(models.AttendanceType, {
      foreignKey: "attendance_type_id",
      as: "attendance_type",
    });

    AttendanceSession.belongsTo(models.AttendanceLocation, {
      foreignKey: "office_location_id",
      as: "attendanceLocation",
    });

    AttendanceSession.belongsTo(models.AttendanceLocation, {
      foreignKey: "office_location_id_check_out",
      as: "attendanceLocationCheckOut",
    });

    AttendanceSession.belongsTo(models.Attendance, {
      foreignKey: "check_in_id",
      as: "check_in",
    });

    AttendanceSession.belongsTo(models.Attendance, {
      foreignKey: "check_out_id",
      as: "check_out",
    });

    AttendanceSession.hasMany(models.Attendance, {
      foreignKey: "attendance_session_id",
      as: "attendances",
    });
  };

  return AttendanceSession;
};
