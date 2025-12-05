# IMS Server - Hệ Thống Quản Lý Nhân Sự

Hệ thống quản lý nhân sự (IMS - Internal Management System) được xây dựng bằng Node.js, Express.js và PostgreSQL.

## 🚀 Tính Năng Chính

- ✅ Quản lý nhân viên và hồ sơ
- ✅ Quản lý kỹ năng nhân viên
- ✅ Quản lý dự án và công việc
- ✅ Hệ thống báo cáo và thống kê
- ✅ API RESTful hoàn chỉnh
- ✅ Tích hợp Zalo Mini App
- ✅ Hỗ trợ WebSocket cho real-time updates

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Authentication**: JWT
- **Process Management**: PM2
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **CI/CD**: GitHub Actions

## 📋 Yêu Cầu Hệ Thống

- Node.js >= 18.0.0
- PostgreSQL >= 12
- Ubuntu/Debian VPS

## 🚀 Cài Đặt và Chạy Local

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
```bash
# Tạo database PostgreSQL
createdb ims_db
```

### 4. Cấu Hình Environment
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

### 5. Chạy Migrations
```bash
npm run db:migrate
npm run db:seed
```

### 6. Chạy Development Server
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## 🌐 Triển Khai Production

### Tự Động Deployment với CI/CD

1. **Cài đặt VPS ban đầu:**
   ```bash
   # Trên VPS
   wget https://raw.githubusercontent.com/dat-nglt/ims-server/main/install.sh
   chmod +x install.sh
   sudo ./install.sh
   ```

2. **Cấu hình GitHub Secrets:**
   - `VPS_USERNAME`: Tên user SSH
   - `VPS_SSH_KEY`: Private SSH key

3. **Auto-deployment:**
   - Push code lên branch `main`
   - GitHub Actions sẽ tự động deploy

### Manual Deployment
```bash
ssh user@your-vps-ip
cd /var/www/ims-server
git pull origin main
npm install
npm run build
pm2 restart ims-server
sudo systemctl reload nginx
```

## 📚 API Documentation

- **Base URL**: `https://videcoder.io.vn/api/v1`
- **Health Check**: `https://videcoder.io.vn/health`
- Chi tiết API: Xem file `API_DOCUMENTATION.md`

## 🔧 Scripts Có Sẵn

```bash
# Development
npm run dev          # Chạy với nodemon
npm start           # Chạy production build

# Database
npm run db:migrate   # Chạy migrations
npm run db:seed      # Seed dữ liệu
npm run db:create    # Tạo database

# Build
npm run build        # Build với Babel
npm run clean        # Xóa thư mục dist
```

## 📁 Cấu Trúc Thư Mục

```
ims-server/
├── src/
│   ├── configs/          # Cấu hình database, migrations
│   ├── controllers/      # Logic xử lý API
│   ├── middlewares/      # Middleware xác thực, CORS
│   ├── models/          # Sequelize models
│   ├── routes/          # Định tuyến API
│   ├── services/        # Business logic
│   └── utils/           # Utilities (logger, etc.)
├── .github/workflows/   # CI/CD workflows
├── logs/               # Application logs
├── install.sh          # Script cài đặt VPS
├── DEPLOYMENT.md       # Hướng dẫn deployment đầy đủ
└── server.js           # Entry point
```

## 🔒 Bảo Mật

- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation với Joi
- SSL/TLS encryption

## 📊 Monitoring

- Winston logging
- PM2 process management
- Nginx access/error logs
- Health check endpoint

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Tạo Pull Request

## 📄 License

ISC License

## 📞 Liên Hệ

- **Domain**: https://videcoder.io.vn
- **Repository**: https://github.com/dat-nglt/ims-server
- **Email**: admin@videcoder.io.vn

---

**Lưu ý**: Đọc `DEPLOYMENT.md` để có hướng dẫn chi tiết về việc triển khai production.