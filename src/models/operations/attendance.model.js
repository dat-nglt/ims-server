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

            // Bản ghi gốc nếu tạo từ multi-technician check-in
            // Nếu technicians trong ảnh có > 1 người, sẽ tạo bản ghi cho mỗi person
            // Và liên kết chúng với parent_attendance_id để theo dõi
            parent_attendance_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "attendance",
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
            // Vĩ độ với validation
            latitude: {
                type: DataTypes.DECIMAL(10, 8),
            },
            // Kinh độ với validation
            longitude: {
                type: DataTypes.DECIMAL(11, 8),
            },
            // Tên địa điểm
            location_name: {
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
            // Thời gian làm việc với validation
            duration_minutes: {
                type: DataTypes.INTEGER,
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
            // Loại chấm công (FK tới attendance_type)
            check_in_type_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "attendance_type",
                    key: "id",
                },
            },
            // Khoảng cách vi phạm (mới: từ violationDistance trong CheckIn.jsx)
            violation_distance: {
                type: DataTypes.DECIMAL(10, 2),
            },
            // Technicians involved at this check-in (JSONB array of user IDs)
            technicians: {
                type: DataTypes.JSONB,
                allowNull: true,
                defaultValue: [],
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
                { fields: ["user_id", "check_in_time"] }, // Composite index cho truy vấn theo user và thời gian
                { fields: ["project_id"] }, // Index mới cho lọc theo dự án
                { fields: ["attendance_session_id"] }, // Index để truy xuất theo phiên chấm công
                { fields: ["parent_attendance_id"] }, // Index để tìm child records
                { fields: ["check_in_type_id"] }, // Index cho lọc theo loại chấm công
                { fields: ["project_id", "check_in_time"] }, // Composite for project-date queries
                { fields: ["work_id", "check_in_time"] }, // Composite for work-date queries
            ],
            hooks: {
                // Hook: compute duration_minutes, set status from check_out_time, and populate location_point from lat/lng
                beforeSave: async (checkIn, options) => {
                    // Compute duration
                    if (checkIn.check_out_time && checkIn.check_in_time) {
                        const durationMs = new Date(checkIn.check_out_time) - new Date(checkIn.check_in_time);
                        checkIn.duration_minutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));
                    }

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
                    if (checkIn.check_out_time) {
                        const session = await AttendanceSession.create(
                            {
                                user_id: checkIn.user_id,
                                work_id: checkIn.work_id,
                                project_id: checkIn.project_id,
                                started_at: checkIn.check_in_time || null,
                                ended_at: checkIn.check_out_time,
                                status: "closed",
                            },
                            { transaction: options.transaction }
                        );

                        checkIn.attendance_session_id = session.id;
                    } else {
                        const [session] = await AttendanceSession.findOrCreate({
                            where: {
                                user_id: checkIn.user_id,
                                work_id: checkIn.work_id,
                                ended_at: null,
                            },
                            defaults: {
                                user_id: checkIn.user_id,
                                work_id: checkIn.work_id,
                                project_id: checkIn.project_id,
                                started_at: checkIn.check_in_time || new Date(),
                                status: "open",
                            },
                            transaction: options.transaction,
                        });

                        checkIn.attendance_session_id = session.id;
                    }
                },

                // After creating record, ensure session references the check-in/check-out ids properly
                // Nếu có nhiều technicians trong ảnh, tạo bản ghi tương tự cho mỗi technician
                afterCreate: async (checkIn, options) => {
                    const AttendanceSession = checkIn.sequelize.models.AttendanceSession;
                    if (!AttendanceSession || !checkIn.attendance_session_id) return;

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
                            { ended_at: checkIn.check_out_time, status: "closed", check_out_id: checkIn.id },
                            { transaction: options.transaction }
                        );
                    }

                    // **Multi-technician logic**: Nếu technicians có > 1 người
                    // Tạo bản ghi tương tự cho các technician khác
                    if (checkIn.technicians && Array.isArray(checkIn.technicians) && checkIn.technicians.length > 1) {
                        const Attendance = checkIn.constructor;
                        const primaryTechnicianId = checkIn.user_id;

                        for (const technicianId of checkIn.technicians) {
                            // Bỏ qua người chấm công gốc
                            if (technicianId === primaryTechnicianId) continue;

                            // Tạo bản ghi tương tự cho technician khác
                            try {
                                await Attendance.create(
                                    {
                                        user_id: technicianId,
                                        work_id: checkIn.work_id,
                                        project_id: checkIn.project_id,
                                        attendance_session_id: checkIn.attendance_session_id,
                                        parent_attendance_id: checkIn.id, // Liên kết bản ghi gốc
                                        check_in_time: checkIn.check_in_time,
                                        check_out_time: checkIn.check_out_time,
                                        latitude: checkIn.latitude,
                                        longitude: checkIn.longitude,
                                        location_name: checkIn.location_name,
                                        address: checkIn.address,
                                        photo_url: checkIn.photo_url,
                                        status: checkIn.status,
                                        distance_from_work: checkIn.distance_from_work,
                                        is_within_radius: checkIn.is_within_radius,
                                        duration_minutes: checkIn.duration_minutes,
                                        device_info: checkIn.device_info,
                                        ip_address: checkIn.ip_address,
                                        notes: checkIn.notes
                                            ? `${checkIn.notes} [Co-technician of ${primaryTechnicianId}]`
                                            : `Co-technician of ${primaryTechnicianId}`,
                                        check_in_type_id: checkIn.check_in_type_id,
                                        violation_distance: checkIn.violation_distance,
                                        technicians: [technicianId, primaryTechnicianId], // Ghi lại cả 2 người trong ảnh
                                    },
                                    { transaction: options.transaction }
                                );
                            } catch (err) {
                                console.error(
                                    `Error creating co-technician record for technician ${technicianId}:`,
                                    err
                                );
                                // Continue processing other technicians
                            }
                        }
                    }
                },

                // On update, if record gets a check_out_time, close the related session
                afterUpdate: async (checkIn, options) => {
                    const AttendanceSession = checkIn.sequelize.models.AttendanceSession;
                    if (!AttendanceSession) return;

                    // If attendance_session_id exists, update it
                    if (checkIn.attendance_session_id && checkIn.check_out_time) {
                        await AttendanceSession.update(
                            { ended_at: checkIn.check_out_time, status: "closed", check_out_id: checkIn.id },
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
                                { ended_at: checkIn.check_out_time, status: "closed", check_out_id: checkIn.id },
                                { transaction: options.transaction }
                            );
                            // also link the check-in to the session if not already linked
                            if (!checkIn.attendance_session_id) {
                                await checkIn.update(
                                    { attendance_session_id: session.id },
                                    { transaction: options.transaction }
                                );
                            }
                        }
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

        Attendance.belongsTo(models.CheckInType, {
            foreignKey: "check_in_type_id",
            as: "checkInType",
        });

        // Liên kết tới attendance session
        Attendance.belongsTo(models.AttendanceSession, {
            foreignKey: "attendance_session_id",
            as: "attendanceSession",
        });

        // Self-referencing: parent_attendance_id → linked to original record
        Attendance.belongsTo(models.Attendance, {
            foreignKey: "parent_attendance_id",
            as: "parentAttendance",
        });

        // Self-referencing: reverse relation để tìm child records
        Attendance.hasMany(models.Attendance, {
            foreignKey: "parent_attendance_id",
            as: "coTechnicianRecords",
        });

        // Technicians: many-to-many relation (optional join table `attendance_technicians`)
        Attendance.belongsToMany(models.User, {
            through: "attendance_technicians",
            foreignKey: "attendance_id",
            otherKey: "user_id",
            as: "associatedTechnicians",
            uniqueKey: false,
        });
    };

    return Attendance;
};
