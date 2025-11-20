'use strict';

/**
 * Model SalesReportDaily (Báo cáo bán hàng hàng ngày)
 * 
 * Lưu trữ các báo cáo bán hàng hàng ngày của nhân viên sales
 */
export default (sequelize, DataTypes) => {
  const SalesReportDaily = sequelize.define(
    'SalesReportDaily',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Mã báo cáo duy nhất
      report_code: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        comment: 'Mã báo cáo bán hàng',
      },
      // ID nhân viên kinh doanh (FK)
      sales_person_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        comment: 'Nhân viên kinh doanh',
      },
      // Ngày báo cáo
      report_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Ngày của báo cáo',
      },
      // Doanh thu với validation
      revenue: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
        comment: 'Tổng doanh thu',
      },
      // Chi phí với validation
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
        comment: 'Tổng chi phí',
      },
      // Lợi nhuận với validation
      profit: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: -999999.99,
        },
        comment: 'Tổng lợi nhuận',
      },
      // Ghi chú
      notes: {
        type: DataTypes.TEXT,
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
      tableName: 'sales_report_daily',
      timestamps: false,
      indexes: [
        { fields: ['sales_person_id'] },
        { fields: ['report_date'] },
        { fields: ['created_at'] },
        { fields: ['sales_person_id', 'report_date'] }, // Non-unique composite index
      ],
    }
  );

  SalesReportDaily.associate = (models) => {
    SalesReportDaily.belongsTo(models.User, {
      foreignKey: 'sales_person_id',
      as: 'salesPerson',
    });
  };

  return SalesReportDaily;
};
