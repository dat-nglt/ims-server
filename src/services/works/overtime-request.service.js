import db from "../../models/index.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";

/**
 * Service: Tạo yêu cầu tăng ca mới
 * @param {Object} data - Dữ liệu yêu cầu tăng ca
 * @returns {Object} - Kết quả thực thi
 */
export const createOvertimeRequestService = async (data) => {
    try {
        const {
            user_id,
            work_id,
            work_title,
            requested_date,
            start_time,
            end_time,
            duration_minutes,
            reason,
            overtime_type,
            technician_ids = [],
        } = data;

        // Validate required fields
        if (!user_id || !requested_date || !start_time || !end_time || !overtime_type || technician_ids.length === 0) {
            return {
                success: false,
                data: null,
                message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc cho yêu cầu tăng ca",
            };
        }

        // Check if user exists
        const user = await db.User.findByPk(user_id);
        if (!user) {
            return {
                success: false,
                data: null,
                message: "Người dùng không tồn tại",
            };
        }

        // If work_id provided, check if work exists
        if (work_id) {
            const work = await db.Work.findByPk(work_id);
            if (!work) {
                return {
                    success: false,
                    data: null,
                    message: "Công việc không tồn tại",
                };
            }
        }

        // Check for duplicate overtime request
        // Check if there's already a pending/approved request with same criteria
        const whereCondition = {
            user_id,
            overtime_type,
            status: {
                [Op.in]: ["pending", "approved"],
            },
        };

        // Add work_id or work_title filter
        if (work_id) {
            whereCondition.work_id = work_id;
        } else if (work_title) {
            whereCondition.work_title = work_title;
        }

        const existingRequest = await db.OvertimeRequest.findOne({
            where: whereCondition,
            include: [
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    attributes: ["technician_id"],
                },
            ],
        });

        // If found existing request, check if technician list overlaps
        if (existingRequest) {
            const existingTechs = existingRequest.technicians.map((t) => t.technician_id);
            const hasOverlap = technician_ids.some((id) => existingTechs.includes(id));

            if (hasOverlap) {
                return {
                    success: false,
                    data: null,
                    message: `Đã tồn tại yêu cầu tăng ca của bạn cho công việc "${
                        work_title || existingRequest.work_title
                    }". Vui lòng chờ đợi phê duyệt`,
                };
            }
        }

        // Create overtime request
        const overtimeRequest = await db.OvertimeRequest.create({
            user_id: user.id,
            work_id,
            work_title,
            requested_date,
            start_time,
            end_time,
            duration_minutes,
            reason,
            overtime_type,
            status: "pending",
        });

        // Create overtime request technician records
        if (Array.isArray(technician_ids) && technician_ids.length > 0) {
            const technicianRecords = technician_ids.map((tech_id) => ({
                overtime_request_id: overtimeRequest.id,
                technician_id: tech_id,
                status: "pending",
            }));
            await db.OvertimeRequestTechnician.bulkCreate(technicianRecords);
        }

        // Fetch with relations
        const result = await db.OvertimeRequest.findByPk(overtimeRequest.id, {
            include: [
                { model: db.User, as: "requester", attributes: ["id", "name", "email", "phone"] },
                { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    include: [{ model: db.User, as: "technician", attributes: ["id", "name", "email", "phone"] }],
                },
            ],
        });

        const resultJson = result.toJSON();

        logger.info(
            `Overtime request created: ${resultJson.id} by user ${user_id} for technicians: ${technician_ids.join(
                ", "
            )}`
        );

        return {
            success: true,
            data: resultJson,
            message: "Yêu cầu tăng ca đã được tạo thành công",
        };
    } catch (error) {
        logger.error("Error in createOvertimeRequestService: " + error.message);
        return {
            success: false,
            data: null,
            message: "Lỗi khi tạo yêu cầu tăng ca: " + error.message,
        };
    }
};

export const createOvertimeRequestServiceOffice = async (data) => {
    try {
        const {
            user_id,
            overtime_category,
            priority,
            requested_date,
            start_time,
            end_time,
            duration_minutes,
            reason,
            notes,
            work_id,
            department_id,
            overtime_type,
        } = data;

        // Validate required fields for office overtime
        if (!user_id || !requested_date || !start_time || !end_time || !reason || !overtime_category) {
            return {
                success: false,
                data: null,
                message: "Thông tin tăng ca không đầy đủ! Vui lòng kiểm tra lại.",
            };
        }

        // Check if user exists
        const user = await db.User.findByPk(user_id);
        if (!user) {
            return {
                success: false,
                data: null,
                message: "Hồ sơ của bạn không tồn tại trong hệ thống quản lý!",
            };
        }

        // Check if department exists (if provided)
        let userDepartmentId = department_id;
        if (department_id) {
            const department = await db.Department.findByPk(department_id);
            if (!department) {
                return {
                    success: false,
                    data: null,
                    message: "Phòng ban không tồn tại",
                };
            }
        } else {
            // Get department from user if not provided
            userDepartmentId = user.department_id;
            if (!userDepartmentId) {
                return {
                    success: false,
                    data: null,
                    message: "Không tìm thấy thông tin phòng ban của nhân viên",
                };
            }
        }

        // Check for duplicate overtime request on same date with overlapping time
        const whereCondition = {
            user_id,
            requested_date,
            status: {
                [Op.in]: ["pending", "approved"],
            },
        };

        const existingRequest = await db.OvertimeRequest.findOne({
            where: whereCondition,
        });

        if (existingRequest) {
            return {
                success: false,
                data: null,
                message: `Đã tồn tại yêu cầu tăng ca cho ngày ${requested_date}. Vui lòng chờ đợi phê duyệt hoặc cập nhật yêu cầu hiện tại`,
            };
        }

        // Create overtime request for office staff
        const overtimeRequest = await db.OvertimeRequest.create({
            user_id,
            work_id: work_id || null,
            department_id: userDepartmentId,
            requested_date,
            start_time,
            end_time,
            duration_minutes: duration_minutes || null,
            reason,
            overtime_category,
            priority: priority || "medium",
            notes: notes || null,
            overtime_type: overtime_type || "overtime_office", // Default type for office staff
            status: "pending",
        });

        // Fetch with relations
        const result = await db.OvertimeRequest.findByPk(overtimeRequest.id, {
            include: [
                { model: db.User, as: "requester", attributes: ["id", "name", "email", "phone"] },
                { model: db.Department, as: "department", attributes: ["id", "name"] },
                { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
            ],
        });

        const resultJson = result.toJSON();

        logger.info(
            `Office overtime request created: ${resultJson.id} by user ${user_id} on ${requested_date} from ${start_time} to ${end_time}`
        );

        return {
            success: true,
            data: resultJson,
            message: "Yêu cầu tăng ca của khối văn phòng đã được tạo thành công",
        };
    } catch (error) {
        logger.error("Error in createOvertimeRequestServiceOffice: " + error.message);
        return {
            success: false,
            data: null,
            message: "Lỗi khi tạo yêu cầu tăng ca: " + error.message,
        };
    }
};

/**
 * Service: Lấy danh sách yêu cầu tăng ca của người dùng
 * @param {number} userId - ID người dùng
 * @param {Object} filters - Bộ lọc (status, startDate, endDate)
 * @returns {Object} - Kết quả thực thi
 */
export const getOvertimeRequestsByUserService = async (userId, filters = {}) => {
    try {
        const { status, startDate, endDate } = filters;

        // Build where condition
        const whereCondition = { user_id: userId };

        if (status) {
            whereCondition.status = status;
        }

        if (startDate || endDate) {
            whereCondition.requested_date = {};
            if (startDate) {
                whereCondition.requested_date[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereCondition.requested_date[Op.lte] = new Date(endDate);
            }
        }

        const { count, rows } = await db.OvertimeRequest.findAndCountAll({
            where: whereCondition,
            include: [
                { model: db.User, as: "requester", attributes: ["id", "name", "email", "phone"] },
                { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
                // { model: db.Department, as: "department", attributes: ["id", "name"] },
                { model: db.User, as: "approver", attributes: ["id", "name"] },
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    include: [{ model: db.User, as: "technician", attributes: ["id", "name", "email", "phone"] }],
                },
            ],
            order: [["requested_date", "DESC"]],
        });

        // Convert to JSON format
        const processedRows = rows.map((row) => row.toJSON());

        return {
            success: true,
            data: processedRows,
            total: count,
            message: "Lấy danh sách yêu cầu tăng ca thành công",
        };
    } catch (error) {
        logger.error("Error in getOvertimeRequestsByUserService: " + error.message);
        return {
            success: false,
            data: [],
            message: "Lỗi khi lấy danh sách yêu cầu tăng ca: " + error.message,
        };
    }
};

/**
 * Service: Lấy danh sách yêu cầu tăng ca chờ duyệt
 * @param {Object} filters - Bộ lọc (startDate, endDate, limit, offset)
 * @returns {Object} - Kết quả thực thi
 */
export const getAllOvertimeRequestsService = async (filters = {}) => {
    try {
        const { startDate, endDate } = filters;

        // Return all overtime requests; we'll order so that pending records come first
        const whereCondition = {};

        if (startDate || endDate) {
            whereCondition.requested_date = {};
            if (startDate) {
                whereCondition.requested_date[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereCondition.requested_date[Op.lte] = new Date(endDate);
            }
        }

        const { rows } = await db.OvertimeRequest.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.User,
                    as: "requester",
                    attributes: ["id", "name", "email", "phone"],
                },
                { model: db.Work, as: "work", attributes: ["id", "title", "location"] },
                { model: db.Department, as: "department", attributes: ["id", "name"] },
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    include: [{ model: db.User, as: "technician", attributes: ["id", "name", "email", "phone"] }],
                },
            ],
            // Put pending requests first (use Sequelize model alias), then sort by requested_date
            order: [
                [db.sequelize.literal('CASE WHEN "OvertimeRequest"."status" = \'pending\' THEN 0 ELSE 1 END'), "ASC"],
                ["requested_date", "ASC"],
            ],
        });

        // Convert to JSON format
        const processedRows = rows.map((row) => row.toJSON());

        return {
            success: true,
            data: processedRows,
            total: processedRows.length,
            message: "Lấy danh sách yêu cầu tăng ca thành công",
        };
    } catch (error) {
        logger.error("Error in getAllOvertimeRequestsService: " + error.message);
        return {
            success: false,
            data: [],
            message: "Lỗi khi lấy danh sách yêu cầu tăng ca: " + error.message,
        };
    }
};

/**
 * Service: Duyệt yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} approverId - ID người duyệt
 * @param {Object} approvalData - {isPaid,, technician_id(optional)}
 * - technician_id: nếu có, chỉ duyệt technician này; nếu không, duyệt tất cả pending
 * @returns {Object} - Kết quả thực thi
 */
export const approveOvertimeRequestService = async (requestId, approverId, approvalData = {}) => {
    try {
        const { is_paid = false, notes, technician_id = null } = approvalData;
        // Check if request exists
        const overtimeRequest = await db.OvertimeRequest.findByPk(requestId);
        if (!overtimeRequest) {
            return {
                success: false,
                data: null,
                message: "Không có yêu cầu tăng ca nào cho công việc hiện tại",
            };
        }

        // Check if approver exists
        const approver = await db.User.findByPk(approverId);
        if (!approver) {
            return {
                success: false,
                data: null,
                message: "Bạn không thể phê duyệt yêu cầu tăng ca này",
            };
        }

        // Check if status is pending
        if (overtimeRequest.status !== "pending") {
            return {
                success: false,
                data: null,
                message: `Không thể duyệt yêu cầu có trạng thái: ${overtimeRequest.status}`,
            };
        }

        // 🟢 KIỂM TRA LOẠI TĂNG CA
        const isOfficeOvertime = overtimeRequest.overtime_type === "overtime_office";

        // 🔷 TRƯỜNG HỢP TĂNG CA VĂN PHÒNG: Cập nhật trực tiếp OvertimeRequest
        if (isOfficeOvertime) {
            await overtimeRequest.update({
                status: "approved",
                approver_id: approverId,
                approved_at: new Date(),
                is_paid,
                notes: notes || null,
            });

            logger.info(
                `Office overtime request ${requestId} approved by user ${approverId}. Paid: ${is_paid}`
            );
        } else {
            // 🔵 TRƯỜNG HỢP TĂNG CA KỸ THUẬT: Cập nhật OvertimeRequestTechnician

            // Build update condition for OvertimeRequestTechnician
            const whereCondition = {
                overtime_request_id: requestId,
                status: "pending",
            };

            // Nếu có technician_id, chỉ duyệt technician đó
            if (technician_id) {
                whereCondition.technician_id = technician_id;

                // Kiểm tra technician record tồn tại
                const techRecord = await db.OvertimeRequestTechnician.findOne({
                    where: whereCondition,
                });

                if (!techRecord) {
                    return {
                        success: false,
                        data: null,
                        message: "Kỹ thuật viên này không trong danh sách chờ duyệt của yêu cầu này",
                    };
                }
            }

            // Update OvertimeRequestTechnician records
            await db.OvertimeRequestTechnician.update(
                {
                    status: "approved",
                    approver_id: approverId,
                    approved_at: new Date(),
                    is_paid,
                    notes,
                },
                { where: whereCondition }
            );

            logger.info(
                `Overtime request ${requestId} technician(s) approved by user ${approverId}. Technician ID: ${
                    technician_id || "all"
                }`
            );
        }

        // Assign approved technicians to the work if not already assigned
        // 📌 CHỈ DÙNG CHO KỸ THUẬT VIÊN
        let newAssignmentsCreated = false;
        if (!isOfficeOvertime && overtimeRequest.work_id) {
            // Get all approved technicians for this request
            const approvedTechs = await db.OvertimeRequestTechnician.findAll({
                where: {
                    overtime_request_id: requestId,
                    status: "approved",
                },
                attributes: ["technician_id"],
                raw: true,
            });

            // For each approved technician, check if already assigned to the work
            for (const techRecord of approvedTechs) {
                const existingAssignment = await db.WorkAssignment.findOne({
                    where: {
                        work_id: overtimeRequest.work_id,
                        technician_id: techRecord.technician_id,
                    },
                });

                // If not assigned, add technician to the work
                if (!existingAssignment) {
                    try {
                        await db.WorkAssignment.create({
                            assigned_by: approverId,
                            work_id: overtimeRequest.work_id,
                            technician_id: techRecord.technician_id,
                            assigned_at: new Date(),
                        });

                        newAssignmentsCreated = true;
                        logger.info(
                            `Technician ${techRecord.technician_id} assigned to work ${overtimeRequest.work_id} from approved overtime request ${requestId}`
                        );
                    } catch (assignmentError) {
                        logger.warn(
                            `Failed to assign technician ${techRecord.technician_id} to work ${overtimeRequest.work_id}: ${assignmentError.message}`
                        );
                        // Continue with other technicians even if one fails
                    }
                }
            }

            // --- Auto-update work status based on assignments if new assignments were created ---
            if (newAssignmentsCreated) {
                try {
                    const work = await db.Work.findByPk(overtimeRequest.work_id);
                    if (work) {
                        // Get all non-cancelled assignments
                        const allAssignments = await db.WorkAssignment.findAll({
                            where: {
                                work_id: overtimeRequest.work_id,
                                assigned_status: { [Op.ne]: "cancelled" },
                            },
                        });

                        if (allAssignments && allAssignments.length > 0) {
                            const assignmentStatuses = allAssignments.map((a) => a.assigned_status);
                            const allCompleted = assignmentStatuses.every((status) => status === "completed");
                            const anyInProgress = assignmentStatuses.some((status) => status === "in_progress");
                            const anyAccepted = assignmentStatuses.some((status) => status === "accepted");

                            // Update work status based on assignments
                            let newWorkStatus = work.status;
                            if (allCompleted) {
                                newWorkStatus = "completed";
                                logger.info(
                                    `All assignments for work ${overtimeRequest.work_id} are completed. Updating work status to completed.`
                                );
                            } else if (anyInProgress) {
                                if (work.status !== "in_progress" && work.status !== "completed") {
                                    newWorkStatus = "in_progress";
                                    logger.info(
                                        `At least one assignment for work ${overtimeRequest.work_id} is in progress. Updating work status to in_progress.`
                                    );
                                }
                            } else if (anyAccepted) {
                                if (work.status === "pending" || work.status === "assigned") {
                                    newWorkStatus = "assigned";
                                    logger.info(
                                        `At least one assignment for work ${overtimeRequest.work_id} is accepted. Updating work status to assigned.`
                                    );
                                }
                            }

                            // Perform status update if changed
                            if (newWorkStatus !== work.status) {
                                await work.update({ status: newWorkStatus, updated_at: new Date() });
                                logger.info(
                                    `Work ${overtimeRequest.work_id} status updated from ${work.status} to ${newWorkStatus} based on assignment statuses.`
                                );
                            }
                        }
                    }
                } catch (statusUpdateErr) {
                    logger.error(
                        "Failed to auto-update work status based on assignments in approveOvertimeRequest: " +
                            statusUpdateErr.message
                    );
                    // Non-blocking error, continue processing
                }
            }
        }

        // 🟢 CẬP NHẬT TRẠNG THÁI REQUEST CHÍNH CHỈ KHI CẦN
        if (!isOfficeOvertime) {
            // Kiểm tra xem TẤT CẢ technician đã được duyệt chưa
            const pendingTechCount = await db.OvertimeRequestTechnician.count({
                where: {
                    overtime_request_id: requestId,
                    status: "pending",
                },
            });

            // Nếu không còn technician pending, update request status thành "approved"
            if (pendingTechCount === 0) {
                await overtimeRequest.update({
                    status: "approved",
                    approver_id: approverId,
                    approved_at: new Date(),
                });
            }
        }

        // Fetch with relations
        const result = await db.OvertimeRequest.findByPk(requestId, {
            include: [
                { model: db.User, as: "requester", attributes: ["id", "name", "email", "phone"] },
                { model: db.User, as: "approver", attributes: ["id", "name"] },
                { model: db.Department, as: "department", attributes: ["id", "name"] },
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    include: [{ model: db.User, as: "technician", attributes: ["id", "name", "email", "phone"] }],
                },
            ],
        });

        const data = result.toJSON();

        let successMessage = "Yêu cầu tăng ca đã được duyệt thành công";
        if (!isOfficeOvertime) {
            successMessage = technician_id
                ? "Duyệt tăng ca cho kỹ thuật viên thành công"
                : "Duyệt tăng ca cho tất cả kỹ thuật viên thành công";
        }

        return {
            success: true,
            data,
            message: successMessage,
        };
    } catch (error) {
        logger.error("Error in approveOvertimeRequestService: " + error.message);
        return {
            success: false,
            data: null,
            message: "Lỗi khi duyệt yêu cầu tăng ca: " + error.message,
        };
    }
};

/**
 * Service: Từ chối yêu cầu tăng ca
 * @param {number} requestId - ID yêu cầu tăng ca
 * @param {number} approverId - ID người từ chối
 * @param {Object} rejectionData - {reject_reason, technician_id(optional)}
 * - technician_id: nếu có, chỉ từ chối technician này; nếu không, từ chối tất cả pending
 * @returns {Object} - Kết quả thực thi
 */
export const rejectOvertimeRequestService = async (requestId, approverId, rejectionData = {}) => {
    try {
        const { reject_reason = "", technician_id = null } = rejectionData;

        // Check if request exists
        const overtimeRequest = await db.OvertimeRequest.findByPk(requestId);
        if (!overtimeRequest) {
            return {
                success: false,
                data: null,
                message: "Yêu cầu tăng ca không tồn tại",
            };
        }

        // Check if approver exists
        const approver = await db.User.findByPk(approverId);
        if (!approver) {
            return {
                success: false,
                data: null,
                message: "Người từ chối không tồn tại",
            };
        }

        // Check if status is pending
        if (overtimeRequest.status !== "pending") {
            return {
                success: false,
                data: null,
                message: `Không thể từ chối yêu cầu có trạng thái: ${overtimeRequest.status}`,
            };
        }

        // 🟢 KIỂM TRA LOẠI TĂNG CA
        const isOfficeOvertime = overtimeRequest.overtime_type === "overtime_office";

        // 🔷 TRƯỜNG HỢP TĂNG CA VĂN PHÒNG: Cập nhật trực tiếp OvertimeRequest
        if (isOfficeOvertime) {
            await overtimeRequest.update({
                status: "rejected",
                approver_id: approverId,
                approved_at: new Date(),
                rejected_reason: reject_reason || null,
                notes: reject_reason || null,
            });

            logger.info(
                `Office overtime request ${requestId} rejected by user ${approverId}. Reason: ${reject_reason}`
            );
        } else {
            // 🔵 TRƯỜNG HỢP TĂNG CA KỸ THUẬT: Cập nhật OvertimeRequestTechnician

            // Build update condition for OvertimeRequestTechnician
            const whereCondition = {
                overtime_request_id: requestId,
                status: "pending",
            };

            // Nếu có technician_id, chỉ từ chối technician đó
            if (technician_id) {
                whereCondition.technician_id = technician_id;

                // Kiểm tra technician record tồn tại
                const techRecord = await db.OvertimeRequestTechnician.findOne({
                    where: whereCondition,
                });

                if (!techRecord) {
                    return {
                        success: false,
                        data: null,
                        message: "Kỹ thuật viên này không trong danh sách chờ duyệt của yêu cầu này",
                    };
                }
            }

            // Update OvertimeRequestTechnician records to rejected
            await db.OvertimeRequestTechnician.update(
                {
                    status: "rejected",
                    approver_id: approverId,
                    approved_at: new Date(),
                    notes: reject_reason,
                },
                { where: whereCondition }
            );

            logger.info(
                `Overtime request ${requestId} technician(s) rejected by user ${approverId}. Technician ID: ${
                    technician_id || "all"
                }`
            );

            // 🟢 CẬP NHẬT TRẠNG THÁI REQUEST CHÍNH CHỈ KHI CẦN
            // Kiểm tra xem có technician pending còn lại không
            const pendingTechCount = await db.OvertimeRequestTechnician.count({
                where: {
                    overtime_request_id: requestId,
                    status: "pending",
                },
            });

            // Nếu không còn technician pending, update request status thành "rejected"
            if (pendingTechCount === 0) {
                await overtimeRequest.update({
                    status: "rejected",
                    approver_id: approverId,
                    approved_at: new Date(),
                    rejected_reason: reject_reason || null,
                    notes: reject_reason || null,
                });
            }
        }

        // Fetch with relations
        const result = await db.OvertimeRequest.findByPk(requestId, {
            include: [
                { model: db.User, as: "requester", attributes: ["id", "name", "email", "phone"] },
                { model: db.User, as: "approver", attributes: ["id", "name"] },
                { model: db.Department, as: "department", attributes: ["id", "name"] },
                {
                    model: db.OvertimeRequestTechnician,
                    as: "technicians",
                    include: [{ model: db.User, as: "technician", attributes: ["id", "name", "email", "phone"] }],
                },
            ],
        });

        const data = result.toJSON();

        let successMessage = "Yêu cầu tăng ca đã bị từ chối thành công";
        if (!isOfficeOvertime) {
            successMessage = technician_id
                ? "Từ chối tăng ca cho kỹ thuật viên thành công"
                : "Từ chối tăng ca cho tất cả kỹ thuật viên thành công";
        }

        return {
            success: true,
            data,
            message: successMessage,
        };
    } catch (error) {
        logger.error("Error in rejectOvertimeRequestService: " + error.message);
        return {
            success: false,
            data: null,
            message: "Lỗi khi từ chối yêu cầu tăng ca: " + error.message,
        };
    }
};

/**
 * Service: Lấy thống kê tăng ca
 * @param {Object} filters - Bộ lọc (userId, department, startDate, endDate, status)
 * @returns {Object} - Kết quả thực thi
 */
export const getOvertimeStatisticsService = async (filters = {}) => {
    try {
        const { userId, department, startDate, endDate, status } = filters;

        const whereCondition = {};

        if (userId) {
            whereCondition.user_id = userId;
        }

        if (status) {
            whereCondition.status = status;
        }

        if (startDate || endDate) {
            whereCondition.requested_date = {};
            if (startDate) {
                whereCondition.requested_date[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereCondition.requested_date[Op.lte] = new Date(endDate);
            }
        }

        // Get statistics
        const total = await db.OvertimeRequest.count({ where: whereCondition });
        const pending = await db.OvertimeRequest.count({
            where: { ...whereCondition, status: "pending" },
        });
        const approved = await db.OvertimeRequest.count({
            where: { ...whereCondition, status: "approved" },
        });
        const rejected = await db.OvertimeRequest.count({
            where: { ...whereCondition, status: "rejected" },
        });
        const cancelled = await db.OvertimeRequest.count({
            where: { ...whereCondition, status: "cancelled" },
        });

        // Calculate total hours (sum of duration_minutes and convert to hours)
        const result = await db.OvertimeRequest.findAll({
            attributes: [[db.sequelize.fn("SUM", db.sequelize.col("duration_minutes")), "totalMinutes"]],
            where: whereCondition,
            raw: true,
        });

        const totalHours = result[0]?.totalMinutes ? result[0].totalMinutes / 60 : 0;

        return {
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected,
                cancelled,
                totalHours: Math.round(totalHours * 10) / 10,
            },
            message: "Lấy thống kê tăng ca thành công",
        };
    } catch (error) {
        logger.error("Error in getOvertimeStatisticsService: " + error.message);
        return {
            success: false,
            data: {},
            message: "Lỗi khi lấy thống kê tăng ca: " + error.message,
        };
    }
};
