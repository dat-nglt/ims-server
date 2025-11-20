// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { v4 as uuidv4 } from "uuid";

import logger from "./src/utils/logger.js";
import mainRouter from "./src/routes/index.js";
import db from "./src/models/index.js";

dotenv.config();

// Hàm khởi động server chính
async function startServer() {
    console.clear();
    logger.info("Bắt đầu khởi tạo server cho Zalo Mini App...");
    const app = express();
    const server = http.createServer(app);

    try {
        // --- CẤU HÌNH MIDDLEWARE BẢO MẬT & HIỆU NĂNG ---
        app.use(helmet());

        // --- MIDDLEWARE THÊM REQUEST ID CHO LOGGING ---
        app.use((req, res, next) => {
            req.id = req.headers["x-request-id"] || uuidv4();
            res.setHeader("X-Request-ID", req.id);
            next();
        });

        // --- RATE LIMIT TOÀN CỤC ---
        app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100000,
                message: { error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
                standardHeaders: true,
                legacyHeaders: false,
                keyGenerator: (req) => req.id,
            })
        );

        // --- RATE LIMIT CHO CÁC API SENSITIVE ---
        const apiLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 phút
            max: 10, // Tối đa 10 requests
            message: { error: "Quá nhiều yêu cầu đến API này, vui lòng thử lại sau." },
        });

        app.use(compression());

        // --- CẤU HÌNH CORS VỚI KIỂM SOÁT CHI TIẾT ---
        const allowedOrigins = ["https://videcoder.io.vn", "https://www.videcoder.io.vn", "https://h5.zdn.vn"];

        if (process.env.NODE_ENV === "development") {
            allowedOrigins.push("http://localhost:3001", "http://localhost:3000");
        }

        const zaloMiniAppRegex = /^https:\/\/([a-z0-9-]+\.)*mini\.123c\.vn$/;

        const corsOptions = {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else if (origin && zaloMiniAppRegex.test(origin)) {
                    callback(null, true);
                } else {
                    logger.warn(`CORS rejected origin: ${origin}`);
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
            credentials: true, // Thêm credentials nếu cần
        };

        app.use(cors(corsOptions));

        // --- CẤU HÌNH PARSER & LOGGING ---
        app.use(express.json({ limit: "10mb" }));
        app.use(express.urlencoded({ extended: true, limit: "10mb" }));
        app.use(
            morgan("combined", {
                stream: { write: (message) => logger.info(message.trim()) },
            })
        );

        // --- MIDDLEWARE LOGGING REQUEST DETAILS ---
        app.use((req, res, next) => {
            logger.info(`[${req.id}] ${req.method} ${req.path} - User Agent: ${req.get("user-agent")}`);
            next();
        });

        // --- SET TIMEOUT CHO REQUESTS ---
        server.setTimeout(30000); // 30 giây timeout

        // --- KẾT NỐI VÀ ĐỒNG BỘ DATABASE ---
        logger.info("---- Đang kết nối tới cơ sở dữ liệu");
        await db.sequelize.authenticate();
        logger.info("Kết nối CSDL thành công");

        if (process.env.NODE_ENV === "development") {
            logger.info("---- Đang đồng bộ CSDL (chỉ tạo bảng nếu chưa tồn tại)");
            // Sử dụng sync { force: false } để tránh xóa dữ liệu
            // Hoặc bỏ qua nếu muốn dùng migrations
            await db.sequelize.sync({ force: false });
            logger.info("Đồng bộ CSDL thành công");
        }

        // --- HEALTH CHECK ENDPOINT ---
        app.get("/health", (req, res) => {
            res.json({
                status: "ok",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: db.sequelize.options.database,
            });
        });

        // --- API VERSIONING ---
        app.use("/api/v1", mainRouter);
        logger.info("Cấu hình routes thành công");

        // --- XỬ LÝ 404 ---
        app.use((req, res) => {
            logger.warn(`[${req.id}] 404 Not Found: ${req.method} ${req.path}`);
            res.status(404).json({
                error: "Endpoint không tồn tại.",
                path: req.path,
                method: req.method,
            });
        });

        // --- MIDDLEWARE XỬ LÝ LỖI ---
        app.use((error, req, res, next) => {
            const errorId = req.id;

            logger.error(`[${errorId}] ${error.status || 500} ${error.message}\n${error.stack}`);

            // Nếu response đã được gửi, bỏ qua
            if (res.headersSent) {
                return next(error);
            }

            const status = error.status || 500;
            const message = process.env.NODE_ENV === "development" ? error.message : "Đã có lỗi xảy ra ở server.";

            res.status(status).json({
                error: message,
                errorId: errorId, // Giúp client report lỗi
                timestamp: new Date().toISOString(),
            });
        });

        // --- XỬ LÝ UNHANDLED PROMISE REJECTION ---
        process.on("unhandledRejection", (reason, promise) => {
            logger.error(`Unhandled Rejection at: ${promise}, reason:`, reason);
        });

        // --- XỬ LÝ UNCAUGHT EXCEPTION ---
        process.on("uncaughtException", (error) => {
            logger.error("Uncaught Exception:", error);
            process.exit(1); // Thoát vì trạng thái không xác định
        });

        // --- KHỞI ĐỘNG SERVER ---
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            logger.info(`Server đang chạy tại cổng ${PORT} [${process.env.NODE_ENV}]`);
            logger.info(`Health Check: http://localhost:${PORT}/health`);
            logger.info(`API - v.1.0: http://localhost:${PORT}/api/v1`);
        });

        // --- GRACEFUL SHUTDOWN ---
        process.on("SIGTERM", async () => {
            logger.info("SIGTERM nhận được, đóng server...");
            server.close(async () => {
                logger.info("Server đã đóng");
                await db.sequelize.close();
                logger.info("Database connection đã đóng");
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error(`Lỗi nghiêm trọng khi khởi động server: ${error.message}`);
        process.exit(1);
    }
}

// Bắt đầu chạy server
startServer();
