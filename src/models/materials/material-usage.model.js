"use strict";

/**
 * Model MaterialUsage (Ghi nhận sử dụng vật tư trong các sub-work/activities)
 *
 * Lưu trữ bản ghi mô tả phần sử dụng vật tư cho các sub-work/công việc con.
 * LƯU Ý: Vật tư là thực thể độc lập; việc liên kết vật tư tới công việc được ghi nhận
 * khi người dùng tạo MaterialUsage hoặc WorkMaterial.
 */
export default (sequelize, DataTypes) => {
    const MaterialUsage = sequelize.define(
        "MaterialUsage",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            // Tham chiếu tới công việc bằng work_code (chuỗi hệ thống)
            work_code: {
                type: DataTypes.STRING(64),
                references: {
                    model: "works",
                    key: "work_code",
                },
                comment: "Mã công việc liên quan (work_code - chuỗi hệ thống)",
            },
            // Tên công việc con / sub-work
            sub_work_name: {
                type: DataTypes.STRING(255),
                comment: "Tên công việc con hoặc hạng mục sử dụng vật tư",
            },
            // Thông tin kỹ thuật viên (nếu có)
            technician_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "users",
                    key: "id",
                },
                comment: "ID kỹ thuật viên thực hiện",
            },
            technician_name: {
                type: DataTypes.STRING(255),
                comment: "Tên kỹ thuật viên (nếu không có user)",
            },
            // Số lượng đã dùng trong bản ghi này
            used_quantity: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Số lượng đã dùng cho sub-work này",
            },
            // Loại ghi nhận (ví dụ: 'used' khi tiêu dùng, 'damaged' khi hỏng)
            usage_type: {
                type: DataTypes.ENUM("used", "damaged", "issued", "returned"),
                defaultValue: "used",
            },
            // Giá đơn vị tại thời điểm ghi nhận (snapshot) để tính giá trị
            unit_price: {
                type: DataTypes.DECIMAL(12, 2),
                defaultValue: 0,
                comment: "Giá 1 đơn vị tại thời điểm ghi nhận",
            },
            // Giá trị = used_quantity * unit_price (snapshot)
            total_value: {
                type: DataTypes.DECIMAL(14, 2),
                defaultValue: 0,
                comment: "Giá trị cho bản ghi này (used_quantity * unit_price)",
            },
            // Ghi chú (ví dụ: lý do hỏng, lưu ý)
            notes: {
                type: DataTypes.TEXT,
                comment: "Ghi chú sử dụng",
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
            tableName: "material_usages",
            timestamps: false,
            indexes: [{ fields: ["material_id"] }, { fields: ["technician_id"] }, { fields: ["work_code"] }],
        }
    );

    MaterialUsage.associate = (models) => {
            MaterialUsage.belongsTo(models.Material, {
            foreignKey: "material_id",
            as: "material",
        });

        MaterialUsage.belongsTo(models.User, {
            foreignKey: "technician_id",
            as: "technician",
        });

        // Nếu usage liên quan tới 1 công việc (tham chiếu bằng work_code)
        MaterialUsage.belongsTo(models.Work, {
            foreignKey: "work_code",
            targetKey: "work_code",
            as: "work",
        });
    };

    // Compute total_value before saving (snapshot)
    MaterialUsage.beforeSave(async (instance) => {
        const unit = parseFloat(instance.unit_price || 0);
        const qty = parseFloat(instance.used_quantity || 0);
        instance.total_value = Number((unit * qty).toFixed(2));
    });

    // Recompute aggregates on create/update/delete to keep Material and WorkMaterial totals consistent
    async function recomputeAggregates(instance, options = {}) {
        const sequelize = MaterialUsage.sequelize;
        const { Material, WorkMaterial } = sequelize.models;
        const Op = sequelize.Sequelize.Op;
        const transaction = options.transaction || (await sequelize.transaction());

        try {
            // Recompute totals for the material
            const usedRow = await MaterialUsage.findOne({
                where: { material_id: instance.material_id, usage_type: { [Op.in]: ['used', 'issued'] } },
                attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'used_sum']],
                raw: true,
                transaction,
            });

            const damagedRow = await MaterialUsage.findOne({
                where: { material_id: instance.material_id, usage_type: 'damaged' },
                attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'damaged_sum']],
                raw: true,
                transaction,
            });

            const usedSum = parseFloat(usedRow?.used_sum || 0);
            const damagedSum = parseFloat(damagedRow?.damaged_sum || 0);

            await Material.update({ used_quantity: usedSum, damaged_quantity: damagedSum }, { where: { id: instance.material_id }, transaction });

            // If usage associated to a work, recompute for that WorkMaterial
            if (instance.work_code) {
                const usedRowW = await MaterialUsage.findOne({
                    where: { material_id: instance.material_id, work_code: instance.work_code, usage_type: { [Op.in]: ['used', 'issued'] } },
                    attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'used_sum']],
                    raw: true,
                    transaction,
                });

                const damagedRowW = await MaterialUsage.findOne({
                    where: { material_id: instance.material_id, work_code: instance.work_code, usage_type: 'damaged' },
                    attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('used_quantity')), 0), 'damaged_sum']],
                    raw: true,
                    transaction,
                });

                const usedSumW = parseFloat(usedRowW?.used_sum || 0);
                const damagedSumW = parseFloat(damagedRowW?.damaged_sum || 0);

                await WorkMaterial.update({ used_quantity: usedSumW, damaged_quantity: damagedSumW }, { where: { work_code: instance.work_code, material_id: instance.material_id }, transaction });
            }

            if (!options.transaction) await transaction.commit();
        } catch (err) {
            if (!options.transaction) await transaction.rollback();
            throw err;
        }
    }

    MaterialUsage.afterCreate(async (instance, options) => {
        await recomputeAggregates(instance, options);
    });

    MaterialUsage.afterUpdate(async (instance, options) => {
        await recomputeAggregates(instance, options);
    });

    MaterialUsage.afterDestroy(async (instance, options) => {
        await recomputeAggregates(instance, options);
    });

    return MaterialUsage;
};
