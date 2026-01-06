import { getAlreadyOpenSession } from "../attendance.service.js";
import db from "../../../models/index.js";
import logger from "../../../utils/logger.js";
/**
 * Check-out người dùng (từ phiên chấm công)
 * @param {Object} checkOutPayLoad - { work_id, user_id, attendance_type_id, photo_url_check_out, latitude_check_out, longitude_check_out, address_check_out, distance_from_work_check_out, early_completion_notes }
 */
export const checkOutService = async (checkOutPayLoad) => {
  try {
    validateInput(checkOutPayLoad);

    await validateWorkAssignment(checkOutPayLoad);

    const attendance = await findAttendanceRecord(checkOutPayLoad);

    validateCheckOutConditions(attendance, checkOutPayLoad);

    const checkOutTime = new Date();
    const updateData = prepareCheckOutData(attendance, checkOutPayLoad, checkOutTime);

    await updateAttendanceRecord(attendance, updateData);

    await computeValidityAndEarlyCompletion(attendance, checkOutPayLoad, checkOutTime);

    await updateWorkStatus(checkOutPayLoad.work_id);

    await updateSession(checkOutPayLoad);

    return { success: true, data: attendance, message: "Chấm công ra thành công" };
  } catch (error) {
    logger.warn("Error in checkOutService:" + error.message);
    return { success: false, message: error.message || "Chấm công ra thất bại", data: null };
  }
};

// Helper functions for checkOutService
const validateInput = (checkOutPayLoad) => {
  if (!checkOutPayLoad || !checkOutPayLoad.work_id || !checkOutPayLoad.user_id || !checkOutPayLoad.attendance_type_id) {
    throw new Error("Thiếu thông tin chấm công ra (work_id, user_id, attendance_type_id)");
  }
};

const validateWorkAssignment = async (checkOutPayLoad) => {
  if (checkOutPayLoad.work_id) {
    const workAssignment = await db.WorkAssignment.findOne({
      where: {
        work_id: checkOutPayLoad.work_id,
        technician_id: checkOutPayLoad.user_id,
        assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted", "completed"] },
      },
    });

    if (!workAssignment) {
      throw new Error("Hệ thống yêu cầu chỉ chấm công ra tại địa điểm công việc được phân bổ");
    }

    // Kiểm tra ngày yêu cầu công việc có phải trong hôm nay hay không (chỉ cho work_id > 0)
    if (checkOutPayLoad.work_id > 0) {
      const work = await db.Work.findByPk(checkOutPayLoad.work_id);
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

const findAttendanceRecord = async (checkOutPayLoad) => {
  let attendance;

  // 1) Thử lấy phiên đang mở hôm nay cho người dùng & công việc
  const sessionSummary = await getAlreadyOpenSession(
    checkOutPayLoad.user_id,
    checkOutPayLoad.attendance_type_id,
    checkOutPayLoad.work_id
  );

  if (sessionSummary?.session) {
    attendance = await db.Attendance.findOne({
      where: {
        attendance_session_id: sessionSummary.session.id,
        user_id: checkOutPayLoad.user_id,
        work_id: checkOutPayLoad.work_id,
        attendance_type_id: checkOutPayLoad.attendance_type_id,
        check_out_time: null,
      },
      order: [["check_in_time", "DESC"]],
    });

    // If session exists but no open attendance found for this work/type, treat as already checked-out
    if (!attendance) {
      throw new Error("Bản ghi chấm công cho công việc này đã được chấm công ra hoặc không tồn tại");
    }
  }

  if (!attendance) {
    // Fallback: match checkout with the earliest hub check-in that is still open
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const hubAttendance = await db.Attendance.findOne({
      where: {
        user_id: checkOutPayLoad.user_id,
        check_out_time: null,
        check_in_time: { [db.Sequelize.Op.between]: [todayStart, todayEnd] },
        [db.Sequelize.Op.or]: [
          { work_id: { [db.Sequelize.Op.in]: [-1, -2] } },
          db.sequelize.where(db.sequelize.json("metadata.hub"), { [db.Sequelize.Op.in]: ["warehouse", "office"] }),
        ],
      },
      order: [["check_in_time", "ASC"]],
    });

    if (hubAttendance) {
      attendance = hubAttendance;
      const hubName = attendance.metadata && attendance.metadata.hub ? attendance.metadata.hub : attendance.work_id;
      logger.info(
        `checkOutService: matched hub check-in id=${attendance.id} hub=${hubName} to checkout for work_id=${checkOutPayLoad.work_id}`
      );
    } else {
      throw new Error("Người dùng chưa chấm công vào hoặc bản ghi chấm công không tồn tại");
    }
  }

  return attendance;
};

const validateCheckOutConditions = (attendance, checkOutPayLoad) => {
  if (attendance.check_out_time) {
    throw new Error("Người dùng đã thực hiện chấm công ra trước đó");
  }

  if (!checkOutPayLoad.latitude_check_out || !checkOutPayLoad.longitude_check_out) {
    throw new Error("Thiếu tọa độ chấm công ra");
  }
};

const prepareCheckOutData = (attendance, checkOutPayLoad, checkOutTime) => {
  const photoUrlCheckOut = checkOutPayLoad.photo_url_check_out
    ? String(checkOutPayLoad.photo_url_check_out).trim()
    : null;
  const latCheckOut = checkOutPayLoad.latitude_check_out || null;
  const lngCheckOut = checkOutPayLoad.longitude_check_out || null;
  const locationNameCheckOut = checkOutPayLoad.location_name_check_out
    ? String(checkOutPayLoad.location_name_check_out).trim()
    : null;
  const checkOutTimeOnLocal = checkOutPayLoad.check_out_time_on_local
    ? new Date(checkOutPayLoad.check_out_time_on_local)
    : null;
  const addressCheckOut = checkOutPayLoad.address_check_out || null;
  const distanceFromWorkCheckOut = checkOutPayLoad.distance_from_work_check_out || null;
  const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000);

  let calculatedViolationDistanceCheckOut = null;
  if (distanceFromWorkCheckOut && distanceFromWorkCheckOut > 150) {
    calculatedViolationDistanceCheckOut = distanceFromWorkCheckOut - 150;
  }

  const isWithinAtCheckOut = distanceFromWorkCheckOut != null ? (distanceFromWorkCheckOut <= 150 ? true : false) : null;

  return {
    work_id: checkOutPayLoad.work_id,
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
  };
};

const updateAttendanceRecord = async (attendance, updateData) => {
  await attendance.update(updateData);
};

const computeValidityAndEarlyCompletion = async (attendance, checkOutPayLoad, checkOutTime) => {
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
          technician_id: checkOutPayLoad.user_id,
          assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted"] },
          work_id: { [db.Sequelize.Op.ne]: checkOutPayLoad.work_id },
        },
      });

      if (otherAssignmentCount === 0) {
        updateData.early_completion_flag = true;
        updateData.early_completion_time = checkOutTime;
        updateData.early_completion_notes = checkOutPayLoad.early_completion_notes || "Hoàn thành sớm";
        updateData.early_completion_reviewed = null;
        updateData.is_valid_time_check_out = false;
      } else {
        updateData.is_valid_time_check_out = true;
      }
    }

    await attendance.update(updateData);

    if (updateData.early_completion_flag) {
      await createEarlyCompletionNotification(attendance, checkOutPayLoad);
    }
  } catch (err) {
    logger.warn("Failed to compute attendance validity: " + err.message);
  }
};

const createEarlyCompletionNotification = async (attendance, checkOutPayLoad) => {
  try {
    const user = await db.User.findByPk(checkOutPayLoad.user_id);
    const work = await db.Work.findByPk(checkOutPayLoad.work_id);

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
  if (work_id) {
    await db.Work.update({ status: "completed" }, { where: { id: work_id } });
  }
};

const updateSession = async (checkOutPayLoad) => {
  // Look up hub session for the same attendance_type so we can attach the work_id when checking out
  const hubSessionSummary = await getAlreadyOpenSession(
    checkOutPayLoad.user_id,
    checkOutPayLoad.attendance_type_id,
    null
  );

  if (hubSessionSummary?.session && hubSessionSummary.session.work_id === null && checkOutPayLoad.work_id) {
    await hubSessionSummary.session.update({ work_id: checkOutPayLoad.work_id });
    logger.info(`Attached work_id=${checkOutPayLoad.work_id} to hub session id=${hubSessionSummary.session.id}`);
  } else {
    logger.info(
      `No hub session to attach for user=${checkOutPayLoad.user_id} attendance_type=${checkOutPayLoad.attendance_type_id}`
    );
  }
};
