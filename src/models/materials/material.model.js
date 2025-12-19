"use strict";

/**
 * Model Material (Vật tư)
 *
 * Lưu trữ thông tin vật tư dùng trong hệ thống.
 * LƯU Ý: Vật tư là thực thể độc lập — chỉ được liên kết tới Dự án/Công việc
 * khi người dùng gán (thông qua `WorkMaterial` hoặc `MaterialUsage`).
 */
export default (sequelize, DataTypes) => {
    const Material = sequelize.define(
        "Material",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            // Mã vật tư (UUID)
            material_code: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                unique: true,
                allowNull: false,
                comment: "Mã vật tư duy nhất (UUID)",
            },
            // Mã/ngắn gọn (ví dụ MAT001)
            code: {
                type: DataTypes.STRING(100),
                unique: true,
                comment: "Mã ngắn của vật tư (ví dụ MAT001)",
            },
            // Tên vật tư
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                comment: "Tên vật tư",
            },
            // Mô tả
            description: {
                type: DataTypes.TEXT,
                comment: "Mô tả vật tư",
            },
            // Đơn vị (Bao, M³, Tấn, ...)
            unit: {
                type: DataTypes.STRING(50),
                comment: "Đơn vị tính",
            },
            // Tổng số lượng hiện có
            quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Tổng số lượng vật tư",
            },
            // Số lượng đã dùng
            used_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Số lượng đã dùng",
            },
            // Số lượng hỏng
            damaged_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Số lượng bị hỏng",
            },
            // Giá trên một đơn vị vật tư (snapshot/hiện tại)
            unit_price: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
                comment: "Giá trên một đơn vị vật tư (dùng để tính giá trị xuất kho)",
            },
            // Mức cảnh báo tồn (tùy chọn)
            reorder_level: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Ngưỡng cảnh báo tồn kho (số lượng)",
            },
            // NOTE: Materials are independent entities. They are not linked directly to a project or work
            // by default; relations to projects/works are created when a user assigns a material to a
            // project or work (see WorkMaterial and MaterialUsage models).
            // No direct project_id/work_id fields here for data normalization.
            // Trạng thái vật tư
            status: {
                type: DataTypes.ENUM("active", "low_stock", "out_of_stock", "inactive"),
                defaultValue: "active",
                comment: "Trạng thái vật tư",
            },
            // Người tạo
            created_by: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID người tạo",
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: "Thời gian tạo bản ghi",
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                comment: "Thời gian cập nhật bản ghi cuối cùng",
            },
        },
        {
            tableName: "materials",
            timestamps: false,
            indexes: [
                { fields: ["material_code"] },
                { fields: ["code"] },
                { fields: ["status"] },
                { fields: ["name"] },
            ],
        }
    );

    Material.associate = (models) => {
        // Materials are independent. When a material is assigned to a project or work,
        // that relationship is represented via WorkMaterial (allocation) or MaterialUsage.
        Material.belongsTo(models.User, {
            foreignKey: "created_by",
            as: "creator",
        });

        Material.hasMany(models.MaterialUsage, {
            foreignKey: "material_id",
            as: "usages",
        });

        // Track allocations to works (optional eager-loading)
        Material.hasMany(models.WorkMaterial, {
            foreignKey: "material_id",
            as: "workAllocations",
        });
    };

    // Recompute material aggregates from usages (safe canonical source)
    Material.recomputeAggregates = async function (materialId, options = {}) {
        const sequelize = Material.sequelize;
        const MaterialUsage = sequelize.models.MaterialUsage;
        const Op = sequelize.Sequelize.Op;
        const transaction = options.transaction || (await sequelize.transaction());

        try {
            const usedRow = await MaterialUsage.findOne({
                where: { material_id: materialId, usage_type: { [Op.in]: ['used', 'issued'] } },
                attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'used_sum']],
                raw: true,
                transaction,
            });

            const damagedRow = await MaterialUsage.findOne({
                where: { material_id: materialId, usage_type: 'damaged' },
                attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'damaged_sum']],
                raw: true,
                transaction,
            });

            const usedSum = parseFloat(usedRow?.used_sum || 0);
            const damagedSum = parseFloat(damagedRow?.damaged_sum || 0);

            await Material.update({ used_quantity: usedSum, damaged_quantity: damagedSum }, { where: { id: materialId }, transaction });

            if (!options.transaction) await transaction.commit();
        } catch (err) {
            if (!options.transaction) await transaction.rollback();
            throw err;
        }
    };

    return Material;
};
