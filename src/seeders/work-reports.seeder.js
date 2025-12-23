'use strict';

/**
 * Seeder: Work Reports
 * Tạo các báo cáo công việc mẫu để test WorkReportsTab component
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Lấy danh sách công việc để gắn báo cáo
      const works = await queryInterface.sequelize.query(
        `SELECT id, work_code, assigned_user_id FROM works LIMIT 5;`
      );
      const workIds = works[0] || [];

      if (workIds.length === 0) {
        console.warn('No works found. Skipping work_reports seeding.');
        return;
      }

      // Lấy danh sách users để gắn báo cáo (reporters, approvers)
      const users = await queryInterface.sequelize.query(
        `SELECT id FROM users LIMIT 10;`
      );
      const userIds = users[0] || [];

      if (userIds.length === 0) {
        console.warn('No users found. Skipping work_reports seeding.');
        return;
      }

      // Sample work reports data
      const workReports = [];

      workIds.forEach((work, workIndex) => {
        const workId = work.id;
        const reporterCount = 2 + Math.floor(Math.random() * 3); // 2-4 reports per work

        for (let i = 0; i < reporterCount; i++) {
          const reportedAtDate = new Date();
          reportedAtDate.setDate(reportedAtDate.getDate() - (reporterCount - i - 1)); // Different dates

          const reporterId = userIds[Math.floor(Math.random() * userIds.length)].id;
          const approverId = userIds[Math.floor(Math.random() * userIds.length)].id;
          const assignedApproverId = userIds[Math.floor(Math.random() * userIds.length)].id;

          const progressPercentage = Math.min(100, (i + 1) * (100 / reporterCount));
          const status = progressPercentage >= 100 ? 'completed' : 'in_progress';
          const approvalStatus = ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)];

          workReports.push({
            work_id: workId,
            project_id: work.project_id || null,
            reported_by: reporterId,
            progress_percentage: Math.round(progressPercentage),
            status,
            description: `Báo cáo tiến độ công việc - Giai đoạn ${i + 1}\n\nĐã hoàn thành: ${Math.round(progressPercentage)}%\nNhân viên báo cáo: ${reporterId}`,
            notes: `Ghi chú báo cáo ${i + 1} - ${work.work_code}`,
            location: `Địa điểm công việc - ${work.work_code}`,
            before_images: [
              `https://via.placeholder.com/300?text=Before+${i + 1}`,
            ],
            during_images: [
              `https://via.placeholder.com/300?text=During+${i + 1}`,
              `https://via.placeholder.com/300?text=During+${i + 1}_2`,
            ],
            after_images: [
              `https://via.placeholder.com/300?text=After+${i + 1}`,
            ],
            assigned_approver: assignedApproverId,
            materials_used: `Vật liệu 1, Vật liệu 2, Vật liệu 3`,
            issues_encountered: i === 0 ? null : `Vấn đề gặp phải: Thiếu một số vật liệu, nhân viên bệnh`,
            solution_applied: i === 0 ? null : `Giải pháp: Mua thêm vật liệu, điều động nhân viên khác`,
            time_spent_hours: 8 + Math.random() * 4, // 8-12 hours
            next_steps: progressPercentage >= 100 
              ? `Hoàn thành công việc, chờ phê duyệt cuối cùng`
              : `Tiếp tục công việc ở giai đoạn tiếp theo`,
            submitted_by_role: 'technician',
            approval_status: approvalStatus,
            approved_by: approvalStatus === 'pending' ? null : approverId,
            approved_at: approvalStatus === 'pending' ? null : new Date(),
            quality_rating: approvalStatus === 'approved' ? (3 + Math.random() * 2) : null, // 3-5 stars if approved
            rejection_reason: approvalStatus === 'rejected' ? 'Chất lượng công việc không đạt yêu cầu' : null,
            reported_at: reportedAtDate,
            created_at: reportedAtDate,
            updated_at: new Date(),
          });
        }
      });

      // Bulk insert
      await queryInterface.bulkInsert('work_reports', workReports, {
        validate: true,
      });

      console.log(`✅ Successfully seeded ${workReports.length} work reports`);
    } catch (error) {
      console.error('❌ Error seeding work_reports:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('work_reports', null, {});
      console.log('✅ Successfully deleted all work_reports');
    } catch (error) {
      console.error('❌ Error deleting work_reports:', error.message);
      throw error;
    }
  },
};
