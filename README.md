# IMS Server - Hệ Thống Quản Lý Nhân Sự

Hệ thống quản lý nhân sự (IMS - Internal Management System) được xây dựng bằng Node.js, Express.js và PostgreSQL, cung cấp API RESTful hoàn chỉnh cho các chức năng quản lý nhân sự, dự án, công việc và báo cáo.

## Tính Năng Chính

- Quản lý nhân viên và hồ sơ nhân viên
- Quản lý kỹ năng kỹ thuật viên
- Quản lý dự án và công việc
- Quản lý phân quyền và vai trò người dùng
- Hệ thống báo cáo và thống kê hiệu suất
- Tích hợp đăng nhập qua Zalo Mini App
- API RESTful hoàn chỉnh
- Hỗ trợ WebSocket cho cập nhật thời gian thực
- Hệ thống thông báo và check-in
- Quản lý tệp đính kèm và lịch sử vị trí

## Công Nghệ Sử Dụng

- **Backend Framework**: Node.js với Express.js
- **Database**: PostgreSQL với Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Process Management**: PM2
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **CI/CD**: GitHub Actions
- **Testing**: Jest (nếu có)
- **Documentation**: JSDoc

## Yêu Cầu Hệ Thống

- Node.js phiên bản 18.0.0 trở lên
- PostgreSQL phiên bản 12 trở lên
- Ubuntu/Debian VPS (cho production)
- npm hoặc yarn

## Cài Đặt và Chạy Local

### 1. Clone Repository
```bash
git clone https://github.com/dat-nglt/ims-server.git
cd ims-server
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Database
Tạo database PostgreSQL:
```bash
createdb ims_db
```

### 4. Cấu Hình Environment Variables
Sao chép file cấu hình mẫu:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database và các biến môi trường cần thiết:
- `DB_HOST`: Địa chỉ database
- `DB_PORT`: Cổng database
- `DB_NAME`: Tên database
- `DB_USER`: Tên người dùng database
- `DB_PASSWORD`: Mật khẩu database
- `JWT_SECRET`: Khóa bí mật JWT
- `PORT`: Cổng chạy server (mặc định 3000)

### 5. Chạy Database Migrations và Seeders
```bash
npm run db:migrate
npm run db:seed
```

### 6. Chạy Development Server
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`.

## Trien Khai Production

## Triển Khai Production

### Tự Động Triển Khai với CI/CD

1. **Cài đặt VPS ban đầu**:
   Chạy script cài đặt trên VPS:
   ```bash
   wget https://raw.githubusercontent.com/dat-nglt/ims-server/main/install.sh
   chmod +x install.sh
   sudo ./install.sh
   ```

2. **Cấu hình GitHub Secrets**:
   - `VPS_USERNAME`: Tên người dùng SSH
   - `VPS_SSH_KEY`: Khóa SSH riêng tư
   - `DB_HOST`, `DB_PASSWORD`, etc.: Thông tin database

3. **Tự động triển khai**:
   Push code lên branch `main`, GitHub Actions sẽ tự động triển khai lên VPS.

### Triển Khai Thủ Công
```bash
ssh user@your-vps-ip
cd /var/www/ims-server
git pull origin main
npm install
npm run build
pm2 restart ims-server
sudo systemctl reload nginx
```

## API Documentation

- **Base URL**: `https://lamquangdai.vn/api/v1/ims`
- **Health Check**: `GET /health`
- **API Endpoints**:
  - `/auth`: Xác thực (đăng nhập, đăng ký, refresh token)
  - `/users`: Quản lý người dùng
  - `/roles`: Quản lý vai trò
  - `/permissions`: Quản lý quyền hạn
  - `/projects`: Quản lý dự án
  - `/works`: Quản lý công việc
  - `/employee-profiles`: Quản lý hồ sơ nhân viên
  - `/technician-skills`: Quản lý kỹ năng kỹ thuật viên
  - `/check-ins`: Check-in và vị trí
  - `/notifications`: Thông báo
  - `/reports`: Báo cáo
  - `/metrics`: Thống kê và dashboard

Chi tiết API documentation xem trong code hoặc sử dụng tools như Postman để test.

## Scripts Có Sẵn

```bash
# Development
npm run dev          # Chạy server với nodemon (tự động restart)
npm start           # Chạy server production

# Database
npm run db:migrate   # Chạy migrations
npm run db:seed      # Seed dữ liệu mẫu
npm run db:create    # Tạo database
npm run db:drop      # Xóa database

# Testing
npm test            # Chạy tests
npm run test:appsecret  # Test app secret

# Build
npm run build        # Build với Babel
npm run clean        # Xóa thư mục dist
```

## Cấu Trúc Thư Mục

```
ims-server/
├── .env                    # Biến môi trường (không commit)
├── .env.example           # Mẫu cấu hình biến môi trường
├── .gitignore             # File bỏ qua git
├── .sequelizerc           # Cấu hình Sequelize CLI
├── install.sh             # Script cài đặt VPS
├── nodemon.json           # Cấu hình Nodemon
├── package.json           # Dependencies và scripts
├── README.md              # Tài liệu này
├── test-appsecret-proof.js # Script test app secret
├── uninstall.sh           # Script gỡ cài đặt
├── .github/
│   └── workflows/
│       └── deploy.yml     # Workflow CI/CD GitHub Actions
└── src/
    ├── server.js          # Điểm vào chính của ứng dụng
    ├── configs/
    │   ├── cli-database.cjs  # Cấu hình CLI database
    │   ├── database.js     # Cấu hình kết nối database
    │   ├── migrations/     # Database migrations
    │   └── seeders/        # Dữ liệu mẫu
    ├── controllers/        # Logic xử lý API
    │   ├── hr/             # Quản lý nhân sự
    │   ├── metrics/        # Thống kê
    │   ├── operations/     # Hoạt động (check-in, thông báo)
    │   ├── projects/       # Dự án
    │   ├── reports/        # Báo cáo
    │   ├── system/         # Cấu hình hệ thống
    │   ├── users/          # Người dùng và quyền
    │   └── works/          # Công việc
    ├── docs/               # Tài liệu
    │   ├── AUTH_MIDDLEWARE.md    # Tài liệu middleware xác thực
    │   ├── DEPLOYMENT.md         # Hướng dẫn triển khai
    │   └── ZALO_INTEGRATION.md   # Tích hợp Zalo
    ├── middlewares/        # Middleware
    │   └── auth.middleware.js    # Middleware xác thực
    ├── models/             # Sequelize models
    │   ├── index.js        # Xuất tất cả models
    │   ├── hr/             # Models nhân sự
    │   ├── operations/     # Models hoạt động
    │   ├── projects/       # Models dự án
    │   ├── reports/        # Models báo cáo
    │   ├── system/         # Models hệ thống
    │   ├── users/          # Models người dùng
    │   └── works/          # Models công việc
    ├── routes/             # Định tuyến API
    │   ├── examples.js     # Ví dụ sử dụng API
    │   ├── index.js        # Tổng hợp tất cả routes
    │   ├── hr/             # Routes nhân sự
    │   ├── metrics/        # Routes thống kê
    │   ├── operations/     # Routes hoạt động
    │   ├── projects/       # Routes dự án
    │   ├── reports/        # Routes báo cáo
    │   ├── system/         # Routes hệ thống
    │   ├── users/          # Routes người dùng
    │   ├── webhooks/       # Routes webhook (Zalo)
    │   └── works/          # Routes công việc
    ├── services/           # Business logic
    │   ├── hr/             # Services nhân sự
    │   ├── metrics/        # Services thống kê
    │   ├── operations/     # Services hoạt động
    │   ├── projects/       # Services dự án
    │   ├── reports/        # Services báo cáo
    │   ├── system/         # Services hệ thống
    │   ├── users/          # Services người dùng
    │   └── works/          # Services công việc
    └── utils/              # Utilities
        └── logger.js       # Logger với Winston
```

## Bảo Mật

- Xác thực JWT với refresh tokens
- Rate limiting để tránh tấn công DDoS
- CORS protection
- Helmet security headers
- Validation đầu vào với Joi
- Mã hóa mật khẩu với bcrypt
- SSL/TLS encryption cho production

## Monitoring và Logging

- Logging với Winston (ghi ra file và console)
- PM2 process management và monitoring
- Nginx access/error logs
- Health check endpoint
- Error handling middleware

## Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Tạo Pull Request

## License

ISC License

## Liên Hệ

- **Domain**: https://lamquangdai.vn
- **Repository**: https://github.com/dat-nglt/ims-server
- **Email**: admin@lamquangdai.vn

---

Doc `DEPLOYMENT.md` de co huong dan chi tiet ve viec trien khai production.