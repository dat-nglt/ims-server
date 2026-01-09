import { getAlreadyOpenSession } from "../attendance.service.js";
import db from "../../../models/index.js";
import logger from "../../../utils/logger.js";
/**
 * Check-out người dùng (từ phiên chấm công)
 * @param {Object} payload - { work_id, user_id, attendance_type_id, photo_url_check_out, latitude_check_out, longitude_check_out, address_check_out, distance_from_work_check_out, check_out_time_on_local, device_info, ip_address, is_within_radius, violation_distance, metadata }
 */
export const checkOutService = async (payload) => {
  try {
    validateInput(payload);

    await validateWorkAssignment(payload);

    const attendance = await findAttendanceRecord(payload);

    validateCheckOutConditions(attendance, payload);

    const checkOutTime = new Date();
    const updateData = prepareCheckOutData(attendance, payload, checkOutTime);

    await updateAttendanceRecord(attendance, updateData);

    await computeValidityAndEarlyCompletion(attendance, payload, checkOutTime);

    await updateWorkStatus(payload.work_id);

    await updateSession(payload);

    return { success: true, data: attendance, message: "Chấm công ra thành công" };
  } catch (error) {
    logger.warn("Error in checkOutService:" + error.message);
    return { success: false, message: error.message || "Chấm công ra thất bại", data: null };
  }
};

// Helper functions for checkOutService
const validateInput = (payload) => {
  if (!payload || !payload.work_id || !payload.user_id || !payload.attendance_type_id) {
    throw new Error("Thiếu thông tin chấm công ra (work_id, user_id, attendance_type_id)");
  }
};

const validateWorkAssignment = async (payload) => {
  if (payload.work_id) {
    const workAssignment = await db.WorkAssignment.findOne({
      where: {
        work_id: payload.work_id,
        technician_id: payload.user_id,
        assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted", "completed"] },
      },
    });

    if (!workAssignment) {
      throw new Error("Hệ thống yêu cầu chỉ chấm công ra tại địa điểm công việc được phân bổ");
    }

    // Kiểm tra ngày yêu cầu công việc có phải trong hôm nay hay không (chỉ cho work_id > 0)
    if (payload.work_id > 0) {
      const work = await db.Work.findByPk(payload.work_id);
      if (work && work.required_date) {
        const today = new Date();
        const workRequiredDate = new Date(work.required_date);
        if (workRequiredDate.toDateString() !== today.toDateString()) {
          throw new Error("Công việc không được yêu cầu thực hiện trong ngày hôm nay");
        }
      }
    }
  }
};

const findAttendanceRecord = async (payload) => {
  // 1) Tìm bản ghi chấm công mở trong phiên chấm công tương ứng với work_id và attendance_type_id của người dùng
  const sessionSummary = await getAlreadyOpenSession(payload.user_id, payload.attendance_type_id, payload.work_id);

  // Nếu có phiên chấm công mở, tìm bản ghi chấm công mở tương ứng với công việc và loại chấm công
  if (sessionSummary?.session) {
    const attendance = await db.Attendance.findOne({
      where: {
        attendance_session_id: sessionSummary.session.id,
        user_id: payload.user_id,
        work_id: payload.work_id,
        attendance_type_id: payload.attendance_type_id,
        check_out_time: null,
      },
      order: [["check_in_time", "DESC"]],
    });

    // If session exists but no open attendance found for this work/type, treat as already checked-out
    if (attendance) {
      return attendance;
    }
  }

  throw new Error("Người dùng chưa chấm công vào cho công việc này hoặc bản ghi chấm công không tồn tại");
};

const validateCheckOutConditions = (attendance, payload) => {
  if (attendance.check_out_time) {
    throw new Error("Người dùng đã thực hiện chấm công ra trước đó");
  }

  if (!payload.latitude_check_out || !payload.longitude_check_out) {
    throw new Error("Thiếu tọa độ chấm công ra");
  }
};

const prepareCheckOutData = (attendance, payload, checkOutTime) => {
  const photoUrlCheckOut = payload.photo_url_check_out ? String(payload.photo_url_check_out).trim() : null;
  const latCheckOut = payload.latitude_check_out || null;
  const lngCheckOut = payload.longitude_check_out || null;
  const locationNameCheckOut = payload.location_name_check_out ? String(payload.location_name_check_out).trim() : null;
  const checkOutTimeOnLocal = payload.check_out_time_on_local ? new Date(payload.check_out_time_on_local) : null;
  const addressCheckOut = payload.address_check_out || null;
  const distanceFromWorkCheckOut = payload.distance_from_work_check_out || null;
  const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000);

  let calculatedViolationDistanceCheckOut = null;
  if (distanceFromWorkCheckOut && distanceFromWorkCheckOut > 150) {
    calculatedViolationDistanceCheckOut = distanceFromWorkCheckOut - 150;
  }

  const isWithinAtCheckOut =
    payload.is_within_radius_check_out !== undefined
      ? payload.is_within_radius_check_out
      : calculatedViolationDistanceCheckOut == null;

  return {
    work_id: payload.work_id,
    check_out_time: checkOutTime,
    check_out_time_on_local: checkOutTimeOnLocal,
    duration_minutes: durationMinutes,
    photo_url_check_out: photoUrlCheckOut,
    address_check_out: addressCheckOut,
    latitude_check_out: latCheckOut ? parseFloat(latCheckOut) : null,
    longitude_check_out: lngCheckOut ? parseFloat(lngCheckOut) : null,
    location_name_check_out: locationNameCheckOut,
    distance_from_work_check_out: distanceFromWorkCheckOut,
    is_within_radius_check_out: isWithinAtCheckOut,
    violation_distance_check_out: calculatedViolationDistanceCheckOut,
    status: "checked_out",
    check_out_metadata: payload.check_out_metadata || {},
  };
};

const updateAttendanceRecord = async (attendance, updateData) => {
  await attendance.update(updateData);
};

const computeValidityAndEarlyCompletion = async (attendance, payload, checkOutTime) => {
  try {
    const fullAttendance = await db.Attendance.findByPk(attendance.id, {
      include: [
        { model: db.AttendanceType, as: "attendanceType" },
        { model: db.Work, as: "work" },
      ],
    });

    let updateData = { is_valid_time_check_out: true };
    let isEarlyCompletion = false;
    if (fullAttendance.attendanceType && fullAttendance.attendanceType.end_time && fullAttendance.check_in_time) {
      const parseToMinutes = (t) => {
        const parts = String(t)
          .split(":")
          .map((p) => parseInt(p, 10) || 0);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
      };
      try {
        const endMinByAttendanceType = parseToMinutes(fullAttendance.attendanceType.end_time);
        const actualCheckOutTime = new Date(checkOutTime);
        const actualCheckOutMin = actualCheckOutTime.getHours() * 60 + actualCheckOutTime.getMinutes();
        if (actualCheckOutMin < endMinByAttendanceType) {
          isEarlyCompletion = true;
        }
      } catch (e) {
        throw new Error("Lỗi khi phân tích thời gian kết thúc của loại chấm công");
      }
    }

    if (isEarlyCompletion) {
      const otherAssignmentCount = await db.WorkAssignment.count({
        where: {
          technician_id: payload.user_id,
          assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted"] },
          work_id: { [db.Sequelize.Op.ne]: payload.work_id },
        },
      });

      if (otherAssignmentCount === 0) {
        updateData.early_completion_flag = true;
        updateData.early_completion_time = checkOutTime;
        updateData.early_completion_notes = payload.early_completion_notes || "Hoàn thành sớm";
        updateData.early_completion_reviewed = null;
        updateData.is_valid_time_check_out = false;
      } else {
        updateData.is_valid_time_check_out = true;
      }
    }

    await attendance.update(updateData);

    if (updateData.early_completion_flag) {
      await createEarlyCompletionNotification(attendance, payload);
    }
  } catch (err) {
    logger.warn("Failed to compute attendance validity: " + err.message);
  }
};

const createEarlyCompletionNotification = async (attendance, payload) => {
  try {
    const user = await db.User.findByPk(payload.user_id);
    const work = await db.Work.findByPk(payload.work_id);

    if (work && user) {
      await db.Notification.create({
        recipient_id: work.created_by,
        type: "early_completion_review",
        title: "Yêu cầu phê duyệt hoàn thành sớm",
        message: `Kỹ thuật viên ${user.name} đã hoàn thành công việc "${work.title}" sớm hơn thời gian quy định. Vui lòng xem xét phê duyệt.`,
        related_attendance_id: attendance.id,
        related_work_id: work.id,
        status: "unread",
      });
    }
  } catch (notificationErr) {
    logger.warn("Failed to create early completion notification: " + notificationErr.message);
  }
};

const updateWorkStatus = async (work_id) => {
  if (work_id && work_id > 0) {
    await db.Work.update({ status: "completed" }, { where: { id: work_id } });
  }
};

const updateSession = async (payload) => {
  // Cập nhật phiên chấm công với thông tin checkout
  if (payload.work_id && payload.work_id > 0) {
    const session = await db.AttendanceSession.findOne({
      where: {
        user_id: payload.user_id,
        work_id: payload.work_id,
        attendance_type_id: payload.attendance_type_id,
        ended_at: null,
      },
    });

    if (session) {
      await session.update({
        ended_at: new Date(),
        status: "closed",
      });
      logger.info(`Closed session id=${session.id} for user=${payload.user_id} work=${payload.work_id}`);
    }
  }
};
