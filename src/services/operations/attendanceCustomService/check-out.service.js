import { getOpenSessionSummaryByUser } from "../attendance.service.js";
import db from "../../../models/index.js";
import logger from "../../../utils/logger.js";
/**
 * Check-out người dùng (từ phiên chấm công)
 * @param {Object} criteria - { work_id, user_id, attendance_type_id, photo_url_check_out, latitude_check_out, longitude_check_out, address_check_out, distance_from_work_check_out, early_completion_notes }
 */
export const checkOutService = async (criteria) => {
  try {
    validateInput(criteria);

    await validateWorkAssignment(criteria);

    const attendance = await findAttendanceRecord(criteria);

    validateCheckOutConditions(attendance, criteria);

    const checkOutTime = new Date();
    const updateData = prepareCheckOutData(attendance, criteria, checkOutTime);

    await updateAttendanceRecord(attendance, updateData);

    await computeValidityAndEarlyCompletion(attendance, criteria, checkOutTime);

    await updateWorkStatus(criteria.work_id);

    await updateSession(criteria);

    return { success: true, data: attendance, message: "Check-out thành công" };
  } catch (error) {
    logger.warn("Error in checkOutService:" + error.message);
    throw error;
  }
};

// Helper functions for checkOutService
const validateInput = (criteria) => {
  if (!criteria || !criteria.work_id || !criteria.user_id || !criteria.attendance_type_id) {
    throw new Error("Thiếu thông tin chấm công ra (work_id, user_id, attendance_type_id)");
  }
};

const validateWorkAssignment = async (criteria) => {
  if (criteria.work_id) {
    const workAssignment = await db.WorkAssignment.findOne({
      where: {
        work_id: criteria.work_id,
        technician_id: criteria.user_id,
        assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted", "completed"] },
      },
    });

    if (!workAssignment) {
      throw new Error("Người dùng không được gán cho công việc này hoặc phân công đã bị từ chối/hủy");
    }

    // Kiểm tra ngày yêu cầu công việc có phải trong hôm nay hay không (chỉ cho work_id > 0)
    if (criteria.work_id > 0) {
      const work = await db.Work.findByPk(criteria.work_id);
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

const findAttendanceRecord = async (criteria) => {
  let attendance;

  // 1) Thử lấy phiên đang mở hôm nay cho người dùng & công việc
  const sessionSummary = await getOpenSessionSummaryByUser(criteria.user_id, criteria.work_id);
  if (sessionSummary?.session) {
    attendance = await db.Attendance.findOne({
      where: {
        attendance_session_id: sessionSummary.session.id,
        user_id: criteria.user_id,
        work_id: criteria.work_id,
        attendance_type_id: criteria.attendance_type_id,
      },
      order: [["check_in_time", "DESC"]],
    });
  }

  if (!attendance) {
    // Fallback: match checkout with the earliest hub check-in that is still open
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const hubAttendance = await db.Attendance.findOne({
      where: {
        user_id: criteria.user_id,
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
        `checkOutService: matched hub check-in id=${attendance.id} hub=${hubName} to checkout for work_id=${criteria.work_id}`
      );
    } else {
      throw new Error("Người dùng chưa chấm công vào hoặc bản ghi chấm công không tồn tại");
    }
  }

  return attendance;
};

const validateCheckOutConditions = (attendance, criteria) => {
  if (attendance.check_out_time) {
    throw new Error("Người dùng đã thực hiện check-out trước đó");
  }

  if (!criteria.latitude_check_out || !criteria.longitude_check_out) {
    throw new Error("Thiếu tọa độ chấm công ra");
  }
};

const prepareCheckOutData = (attendance, criteria, checkOutTime) => {
  const photoUrlCheckOut = criteria.photo_url_check_out ? String(criteria.photo_url_check_out).trim() : null;
  const latCheckOut = criteria.latitude_check_out || null;
  const lngCheckOut = criteria.longitude_check_out || null;
  const addressCheckOut = criteria.address_check_out || null;
  const distanceFromWorkCheckOut = criteria.distance_from_work_check_out || null;
  const durationMinutes = Math.round((checkOutTime - attendance.check_in_time) / 60000);

  let calculatedViolationDistanceCheckOut = null;
  if (distanceFromWorkCheckOut && distanceFromWorkCheckOut > 150) {
    calculatedViolationDistanceCheckOut = distanceFromWorkCheckOut - 150;
  }

  const isWithinAtCheckOut = distanceFromWorkCheckOut != null ? (distanceFromWorkCheckOut <= 150 ? true : false) : null;

  return {
    work_id: criteria.work_id,
    check_out_time: checkOutTime,
    duration_minutes: durationMinutes,
    photo_url_check_out: photoUrlCheckOut,
    address_check_out: addressCheckOut,
    latitude_check_out: latCheckOut ? parseFloat(latCheckOut) : null,
    longitude_check_out: lngCheckOut ? parseFloat(lngCheckOut) : null,
    distance_from_work_check_out: distanceFromWorkCheckOut,
    is_within_radius_check_out: isWithinAtCheckOut,
    violation_distance_check_out: calculatedViolationDistanceCheckOut,
    status: "checked_out",
  };
};

const updateAttendanceRecord = async (attendance, updateData) => {
  await attendance.update(updateData);
};

const computeValidityAndEarlyCompletion = async (attendance, criteria, checkOutTime) => {
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
          technician_id: criteria.user_id,
          assigned_status: { [db.Sequelize.Op.in]: ["pending", "accepted"] },
          work_id: { [db.Sequelize.Op.ne]: criteria.work_id },
        },
      });

      if (otherAssignmentCount === 0) {
        updateData.early_completion_flag = true;
        updateData.early_completion_time = checkOutTime;
        updateData.early_completion_notes = criteria.early_completion_notes || "Hoàn thành sớm";
        updateData.early_completion_reviewed = null;
        updateData.is_valid_time_check_out = false;
      } else {
        updateData.is_valid_time_check_out = true;
      }
    }

    await attendance.update(updateData);

    if (updateData.early_completion_flag) {
      await createEarlyCompletionNotification(attendance, criteria);
    }
  } catch (err) {
    logger.warn("Failed to compute attendance validity: " + err.message);
  }
};

const createEarlyCompletionNotification = async (attendance, criteria) => {
  try {
    const user = await db.User.findByPk(criteria.user_id);
    const work = await db.Work.findByPk(criteria.work_id);

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

const updateSession = async (criteria) => {
  const hubSessionSummary = await getOpenSessionSummaryByUser(criteria.user_id, null);
  if (hubSessionSummary?.session && hubSessionSummary.session.work_id === null && criteria.work_id) {
    await hubSessionSummary.session.update({ work_id: criteria.work_id });
  }
};
