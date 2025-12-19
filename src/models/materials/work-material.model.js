"use strict";

/**
 * Model WorkMaterial (Allocation of materials to a Work)
 *
 * Lưu trữ bản ghi thể hiện vật tư được xuất/allocate cho từng công việc.
 * LƯU Ý: Vật tư là thực thể độc lập; mối quan hệ đến công việc được tạo khi người dùng
 * cấp/allocate vật tư cho công việc (thông qua `WorkMaterial`).
 */
export default (sequelize, DataTypes) => {
    const WorkMaterial = sequelize.define(
        "WorkMaterial",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            work_code: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "works",
                    key: "work_code",
                },
                comment: "Mã công việc liên quan (work_code - UUID)",
            },
            material_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "materials",
                    key: "id",
                },
                comment: "ID vật tư",
            },
            // Số lượng được cấp/issued cho công việc
            allocated_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Số lượng đã xuất/allocated cho công việc",
                validate: { min: 0 },
            },
            // Tổng số đã dùng (cập nhật từ usages)
            used_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Tổng số đã dùng cho allocation này",
                validate: { min: 0 },
            },
            // Tổng hỏng
            damaged_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Tổng số bị hỏng cho allocation này",
                validate: { min: 0 },
            },
            // Giá đơn vị tại thời điểm allocation (snapshot)
            unit_price_snapshot: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
                comment: "Giá đơn vị khi xuất vật tư cho công việc",
            },
            // Tổng giá trị đã phát = allocated_quantity * unit_price_snapshot
            total_value_issued: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Tổng giá trị đã phát cho allocation này",
            },
            // Người/ Kỹ thuật viên chịu trách nhiệm với allocation
            technician_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID kỹ thuật viên chịu trách nhiệm",
            },
            // Trạng thái allocation
            status: {
                type: DataTypes.ENUM("allocated", "in_progress", "completed", "cancelled"),
                defaultValue: "allocated",
                comment: "Trạng thái allocation",
            },
            notes: {
                type: DataTypes.TEXT,
                comment: "Ghi chú dành cho allocation",
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
            tableName: "work_materials",
            timestamps: false,
            indexes: [
                { fields: ["work_code"] },
                { fields: ["material_id"] },
                { fields: ["work_code", "material_id"] },
                { fields: ["technician_id"] },
                { fields: ["status"] },
            ],
        }
    );

    WorkMaterial.associate = (models) => {
        WorkMaterial.belongsTo(models.Work, {
            foreignKey: "work_code",
            targetKey: "work_code",
            as: "work",
        });

        WorkMaterial.belongsTo(models.Material, {
            foreignKey: "material_id",
            as: "material",
        });

        WorkMaterial.belongsTo(models.User, {
            foreignKey: "technician_id",
            as: "technician",
        });
    };

    // compute total_value_issued before save
    WorkMaterial.beforeSave(async (instance) => {
        const unit = parseFloat(instance.unit_price_snapshot || 0);
        const qty = parseFloat(instance.allocated_quantity || 0);
        instance.total_value_issued = Number((unit * qty).toFixed(2));
    });

    return WorkMaterial;
};
