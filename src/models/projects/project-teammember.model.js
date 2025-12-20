"use strict";

/**
 * Model ProjectTeamMember
 *
 * Lưu trữ thông tin thành viên tham gia dự án (có thể tham chiếu tới User hoặc chỉ lưu thông tin tạm)
 */
export default (sequelize, DataTypes) => {
    const ProjectTeamMember = sequelize.define(
        "ProjectTeamMember",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            project_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "projects",
                    key: "id",
                },
                comment: "ID dự án",
            },
            // Nếu là user hệ thống
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID user (nếu ứng viên là user hệ thống)",
            },
            // Tên thành viên (dùng khi user_id null hoặc để thuận tiện)
            name: {
                type: DataTypes.STRING(255),
                comment: "Tên thành viên",
            },
            role: {
                type: DataTypes.STRING(100),
                comment: "Vai trò trong dự án",
            },
            days_worked: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: "Số ngày công đã làm",
            },
            allocation_percent: {
                type: DataTypes.DECIMAL(5, 2),
                defaultValue: 0,
                comment: "Phần trăm phân công (%)",
            },
        },
        {
            tableName: "project_team_members",
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ["project_id"] },
                { fields: ["user_id"] },
            ],
        }
    );

    ProjectTeamMember.associate = (models) => {
        ProjectTeamMember.belongsTo(models.Project, {
            foreignKey: "project_id",
            as: "project",
        });

        ProjectTeamMember.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
    };

    return ProjectTeamMember;
};