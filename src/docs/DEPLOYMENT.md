# Hướng Dẫn Triển Khai CI/CD Đầy Đủ Cho Hệ Thống IMS Server

## Giới Thiệu

Tài liệu này cung cấp hướng dẫn chi tiết để triển khai hệ thống IMS Server lên VPS với quy trình CI/CD tự động. Khi push code lên branch `main`, hệ thống sẽ tự động cập nhật và chạy trên VPS.

## Yêu Cầu Hệ Thống

### VPS Requirements

- **OS**: Ubuntu 20.04 LTS hoặc cao hơn (hoặc Debian tương thích)
- **CPU**: Tối thiểu 1 core
- **RAM**: Tối thiểu 1GB
- **Disk**: Tối thiểu 20GB
- **Network**: IP tĩnh (14.225.218.37)

### Domain & DNS

- Domain: `videcoder.io.vn`
- Cần cấu hình DNS trỏ về IP VPS: `14.225.218.37`

### Repository

- GitHub Repository: `https://github.com/dat-nglt/ims-server.git`
- Branch chính: `main`

## Cài Đặt VPS Ban Đầu

### Bước 1: Kết nối SSH vào VPS

```bash
ssh user@14.225.218.37
```

### Bước 2: Chạy Script Cài Đặt Tự Động

```bash
# Tải script từ repository
wget https://raw.githubusercontent.com/dat-nglt/ims-server/main/install.sh
chmod +x install.sh

# Chạy script với quyền root
sudo ./install.sh

pm2 start npm --name ims-server -- start --prefix /var/www/ims-server

```

**Lưu ý quan trọng:**

- Script sẽ cài đặt tất cả thành phần cần thiết
- Sau khi chạy, cần cập nhật thông tin trong file `.env`

### Bước 3: Cập Nhật Cấu Hình

Chỉnh sửa file `/var/www/ims-server/.env`:

```bash
sudo nano /var/www/ims-server/.env
```

Cập nhật các thông tin sau:

```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ims_db
DB_USER=ims_user
DB_PASSWORD=your_secure_password_here
# Thêm các biến môi trường khác nếu cần
```

### Bước 4: Cấu Hình Database

```bash
# Đăng nhập PostgreSQL
sudo -u postgres psql

# Thay đổi password cho user ims_user
ALTER USER ims_user PASSWORD 'your_secure_password_here';

# Thoát
\q
```

## Cấu Hình CI/CD Với GitHub Actions

### Bước 1: Tạo SSH Key

Trên máy local (không phải trên VPS):

```bash
# Tạo SSH key pair mới (không ghi đè key hiện có)
ssh-keygen -t rsa -b 4096 -C "github-actions@videcoder.io.vn" -f ~/.ssh/github_actions_key

# Hoặc nếu muốn sử dụng key mặc định (có thể ghi đè)
ssh-keygen -t rsa -b 4096 -C "github-actions@videcoder.io.vn"
```

**Quan trọng:** Khi được hỏi passphrase, hãy nhấn Enter để không đặt passphrase (GitHub Actions cần key không có passphrase).

#### Cách lấy VPS_SSH_KEY:

**Nếu sử dụng key mặc định (~/.ssh/id_rsa):**

```bash
# Hiển thị nội dung private key
cat ~/.ssh/id_rsa
```

**Nếu tạo key riêng (khuyến nghị):**

```bash
# Hiển thị nội dung private key từ file mới tạo
cat ~/.ssh/github_actions_key
```

**Copy toàn bộ nội dung** từ `-----BEGIN OPENSSH PRIVATE KEY-----` đến `-----END OPENSSH PRIVATE KEY-----` (bao gồm cả 2 dòng này).

#### Cài đặt public key lên VPS:

```bash
# Nếu sử dụng key mặc định
ssh-copy-id -i ~/.ssh/id_rsa.pub user@14.225.218.37

# Nếu sử dụng key riêng
ssh-copy-id -i ~/.ssh/github_actions_key.pub root@14.225.218.37
```

#### Kiểm tra kết nối SSH:

```bash
# Test kết nối với key mới
ssh -i ~/.ssh/github_actions_key user@14.225.218.37 "echo 'SSH connection successful'"
```

### Bước 2: Cấu Hình GitHub Secrets

1. Truy cập repository trên GitHub: `https://github.com/dat-nglt/ims-server`
2. Vào **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Thêm các secrets sau:

| Secret Name     | Value                                                      | Mô tả                                      |
| --------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `root`        | Tên user SSH của VPS (ví dụ:`root` hoặc `ubuntu`) | Tên user để SSH vào VPS                  |
| `VPS_SSH_KEY` | Nội dung private key SSH (từ bước 1)                   | Private key để GitHub Actions SSH vào VPS |

**Lưu ý quan trọng:**

- `VPS_SSH_KEY` phải là nội dung đầy đủ của private key (từ `-----BEGIN OPENSSH PRIVATE KEY-----` đến `-----END OPENSSH PRIVATE KEY-----`)
- Không thêm khoảng trắng hoặc ký tự thừa
- Đảm bảo key không có passphrase

### Bước 3: Workflow File

File `.github/workflows/deploy.yml` đã được tạo với nội dung:

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to VPS
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: 14.225.218.37
        username: ${{ secrets.VPS_USERNAME }}
        key: ${{ secrets.VPS_SSH_KEY }}
        port: 22
        script: |
          cd /var/www/ims-server
          git pull origin main
          npm install
          npm run build
          pm2 restart ims-server
          sudo systemctl reload nginx
```

## Quy Trình Deployment

### Tự Động Deployment

1. Push code lên branch `main`
2. GitHub Actions sẽ trigger workflow
3. Code được pull về VPS
4. Dependencies được cài đặt
5. Application được build
6. PM2 restart service
7. Nginx reload cấu hình

### Manual Deployment

Nếu cần deploy thủ công:

```bash
ssh user@14.225.218.37
cd /var/www/ims-server
git pull origin main
npm install
npm run build
pm2 restart ims-server
sudo systemctl reload nginx
```

## Cấu Hình SSL Certificate

SSL certificate được tự động cấu hình bởi Certbot. Để renew certificate:

```bash
# Kiểm tra renewal
sudo certbot renew

# Reload Nginx sau khi renew
sudo systemctl reload nginx
```

Certificate sẽ tự động renew trước khi hết hạn.

## Giám Sát và Bảo Trì

### Kiểm Tra Trạng Thái Application

```bash
# Kiểm tra PM2 processes
pm2 list

# Xem logs
pm2 logs ims-server

# Restart application
pm2 restart ims-server
```

### Kiểm Tra Database

```bash
# Kết nối database
sudo -u postgres psql -d ims_db

# Kiểm tra tables
\dt

# Thoát
\q
```

### Backup Database

```bash
# Tạo backup
sudo -u postgres pg_dump ims_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
sudo -u postgres psql ims_db < backup_file.sql
```

### Logs và Monitoring

- Application logs: `/var/www/ims-server/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx` hoặc `journalctl -u postgresql`

## Troubleshooting

### Application Không Khởi Động

```bash
# Kiểm tra logs
pm2 logs ims-server --lines 100

# Kiểm tra syntax
npm run build

# Restart manual
pm2 restart ims-server
```

### Database Connection Error

```bash
# Kiểm tra PostgreSQL service
sudo systemctl status postgresql

# Kiểm tra connection
sudo -u postgres psql -c "SELECT version();"

# Kiểm tra credentials trong .env
cat /var/www/ims-server/.env
```

### Nginx Error

```bash
# Test cấu hình
sudo nginx -t

# Reload cấu hình
sudo systemctl reload nginx

# Kiểm tra logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Reconfigure certificate
sudo certbot --nginx -d videcoder.io.vn -d www.videcoder.io.vn
```

## Bảo Mật

### Cập Nhật Hệ Thống

```bash
sudo apt update && sudo apt upgrade -y
```

### Cấu Hình Firewall

```bash
# Kiểm tra rules
sudo ufw status

# Chỉ cho phép cần thiết
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### Bảo Mật Database

- Sử dụng password mạnh
- Giới hạn kết nối từ localhost
- Thường xuyên backup

## Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:

1. Logs của application và system
2. Trạng thái services (PM2, Nginx, PostgreSQL)
3. Cấu hình files (.env, nginx config)
4. Network connectivity

Domain: `https://videcoder.io.vn`
Health Check: `https://videcoder.io.vn/health`
