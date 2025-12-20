"use strict";

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Import models from subfolders
import { EmployeeProfile, TechnicianSkill } from "./hr/index.js";
// Removed DashboardMetric and PerformanceMetric - data calculated from other models
import {
    Attachment,
    Attendance,
    AttendanceSession,
    AttendanceSessionHistory,
    CheckInType,
    Notification,
    OfficeLocation,
    LocationHistory,
} from "./operations/index.js";
import { SalesReportDaily } from "./reports/index.js";
import { SystemConfig } from "./system/index.js";
import {
    Permission,
    Role,
    User,
    RolePermissions,
    UserRoles,
} from "./users/index.js";
import {
    ProjectHistory,
    Project,
    ProjectTeamMember,
} from "./projects/index.js";
import {
    Work,
    WorkAssignment,
    WorkCategory,
    WorkHistory,
    WorkReport,
} from "./works/index.js";
import { Material, MaterialUsage, WorkMaterial } from "./materials/index.js";
import { Customer } from "./customers/index.js";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "ims_db",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || "postgres",
        logging: process.env.DB_LOGGING === "true" ? console.log : false,
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const db = {};

// List of all model functions
const models = [
    EmployeeProfile,
    TechnicianSkill,
    Attachment,
    Attendance,
    AttendanceSession,
    AttendanceSessionHistory,
    CheckInType,
    Notification,
    OfficeLocation,
    LocationHistory,
    SalesReportDaily,
    SystemConfig,
    Permission,
    Role,
    User,
    RolePermissions,
    UserRoles,
    ProjectHistory,
    Project,
    ProjectTeamMember,
    Work,
    WorkAssignment,
    WorkCategory,
    WorkHistory,
    WorkReport,
    Material,
    MaterialUsage,
    WorkMaterial,
    Customer,
];

// Register models
for (const model of models) {
    const modelDef = model(sequelize, Sequelize.DataTypes);
    db[modelDef.name] = modelDef;
}

// Call associate methods
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
