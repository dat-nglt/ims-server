// server.js

// Import necessary modules for environment variables, web framework, security, logging, etc.
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { v4 as uuidv4 } from "uuid";

// Import custom utilities and modules: logger for logging, mainRouter for routes, db for database models
import logger from "./utils/logger.js";
import mainRouter from "./routes/index.js";
import db from "./models/index.js";

// Load environment variables from .env file
dotenv.config();

// Main function to start the server, handling initialization, middleware, database, and error handling
async function startServer() {
    // Clear console for clean output
    console.clear();
    // Log server initialization for Zalo Mini App
    logger.info("Bắt đầu khởi tạo server cho Zalo Mini App...");
    // Create Express app and HTTP server
    const app = express();
    const server = http.createServer(app);

    try {
        // --- SECURITY & PERFORMANCE MIDDLEWARE CONFIGURATION ---
        // Use Helmet for security headers
        app.use(helmet());

        // --- REQUEST ID MIDDLEWARE FOR LOGGING ---
        // Middleware to add a unique request ID for tracking requests in logs
        app.use((req, res, next) => {
            req.id = req.headers["x-request-id"] || uuidv4();
            res.setHeader("X-Request-ID", req.id);
            next();
        });

        // --- GLOBAL RATE LIMITING ---
        // Apply rate limiting to prevent abuse: 100,000 requests per 15 minutes per request ID
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

        // --- RATE LIMITING FOR SENSITIVE APIs ---
        // Stricter rate limit for sensitive endpoints: 10 requests per minute
        const apiLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 10, // Max 10 requests
            message: {
                error: "Quá nhiều yêu cầu đến API này, vui lòng thử lại sau.",
            },
        });

        // Enable compression for responses
        app.use(compression());

        // --- DETAILED CORS CONFIGURATION ---
        // Define allowed origins for CORS, including production and development domains
        const allowedOrigins = [
            "https://videcoder.io.vn",
            "https://www.videcoder.io.vn",
            "https://h5.zdn.vn",
        ];

        // Add localhost origins if in development mode
        if (process.env.NODE_ENV === "development") {
            allowedOrigins.push(
                "http://localhost:3001",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"
            );
        }

        // Regex to allow Zalo Mini App subdomains
        const zaloMiniAppRegex = /^https:\/\/([a-z0-9-]+\.)*mini\.123c\.vn$/;

        // CORS options with origin validation
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
            credentials: true, // Allow credentials if needed
        };

        // Apply CORS middleware
        app.use(cors(corsOptions));

        // --- PARSER & LOGGING CONFIGURATION ---
        // Parse JSON and URL-encoded bodies with size limits
        app.use(express.json({ limit: "10mb" }));
        app.use(express.urlencoded({ extended: true, limit: "10mb" }));
        // Use Morgan for HTTP request logging, streaming to custom logger
        app.use(
            morgan("combined", {
                stream: { write: (message) => logger.info(message.trim()) },
            })
        );

        // --- REQUEST DETAILS LOGGING MIDDLEWARE ---
        // Log detailed request info including method, path, and user agent
        app.use((req, res, next) => {
            logger.info(
                `[${req.id}] ${req.method} ${req.path} - User Agent: ${req.get(
                    "user-agent"
                )}`
            );
            next();
        });

        // --- SET REQUEST TIMEOUT ---
        // Set server timeout to 30 seconds to prevent hanging requests
        server.setTimeout(30000); // 30 seconds timeout

        // --- DATABASE CONNECTION & SYNCHRONIZATION ---
        // Log database connection attempt
        logger.info("---- Đang kết nối tới cơ sở dữ liệu");
        // Authenticate database connection
        await db.sequelize.authenticate();
        logger.info("Kết nối CSDL thành công");

        // In development, sync database schema without forcing data loss
        if (process.env.NODE_ENV === "development") {
            logger.info(
                "---- Đang đồng bộ CSDL (chỉ tạo bảng nếu chưa tồn tại)"
            );
            // Sync with force: false to avoid dropping tables
            await db.sequelize.sync({ force: false });
            logger.info("Đồng bộ CSDL thành công");
        }

        // --- HEALTH CHECK ENDPOINT ---
        // Simple endpoint to check server health, uptime, and database info
        app.get("/health", (req, res) => {
            res.json({
                status: "ok",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                database: db.sequelize.options.database,
            });
        });

        // --- API VERSIONING ---
        // Mount main router for API routes
        mainRouter(app);
        logger.info("Cấu hình routes thành công");

        // --- 404 HANDLER ---
        // Handle 404 errors for undefined routes
        app.use((req, res) => {
            logger.warn(`[${req.id}] 404 Not Found: ${req.method} ${req.path}`);
            res.status(404).json({
                error: "Endpoint không tồn tại.",
                path: req.path,
                method: req.method,
            });
        });

        // --- ERROR HANDLING MIDDLEWARE ---
        // Centralized error handler for all routes
        app.use((error, req, res, next) => {
            const errorId = req.id;

            // Log error with stack trace
            logger.error(
                `[${errorId}] ${error.status || 500} ${error.message}\n${
                    error.stack
                }`
            );

            // Skip if response already sent
            if (res.headersSent) {
                return next(error);
            }

            // Determine status and message based on environment
            const status = error.status || 500;
            const message =
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Đã có lỗi xảy ra ở server.";

            // Send error response
            res.status(status).json({
                error: message,
                errorId: errorId, // For client-side error reporting
                timestamp: new Date().toISOString(),
            });
        });

        // --- UNHANDLED PROMISE REJECTION HANDLER ---
        // Handle unhandled promise rejections to prevent crashes
        process.on("unhandledRejection", (reason, promise) => {
            logger.error(`Unhandled Rejection at: ${promise}, reason:`, reason);
        });

        // --- UNCAUGHT EXCEPTION HANDLER ---
        // Handle uncaught exceptions and exit gracefully
        process.on("uncaughtException", (error) => {
            logger.error("Uncaught Exception:", error);
            process.exit(1); // Exit due to undefined state
        });

        // --- START SERVER ---
        // Get port from environment or default to 3000
        const PORT = process.env.PORT || 3000;

        // Listen on the port
        server.listen(PORT, () => {
            logger.info(
                `Server đang chạy tại cổng ${PORT} [${process.env.NODE_ENV}]`
            );
            logger.info(`Health Check: https://videcoder.io.vn/health`);
            logger.info(`API - v.1.0: https://videcoder.io.vn/api/v1`);
        });

        // --- GRACEFUL SHUTDOWN ---
        // Handle SIGTERM for graceful shutdown
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
        // Log critical startup error and exit
        logger.error(`Lỗi nghiêm trọng khi khởi động server: ${error}`);
        process.exit(1);
    }
}

// Start the server by calling the main function
startServer();
