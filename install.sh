#!/bin/bash

# VPS Auto Installation Script for IMS Server
# This script sets up the VPS with Node.js, PostgreSQL, Nginx, and deploys the application
# Script này có thể chạy nhiều lần an toàn (idempotent)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Bắt đầu cài đặt VPS tự động cho IMS Server...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if service is running
service_running() {
    sudo systemctl is-active --quiet "$1"
}

# Update system
echo -e "${YELLOW}📦 Cập nhật hệ thống...${NC}"
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo -e "${YELLOW}🔧 Cài đặt các gói cần thiết...${NC}"
sudo apt install -y curl wget git ufw software-properties-common

# Install Node.js (latest LTS) if not installed
if ! command_exists node; then
    echo -e "${YELLOW}📦 Cài đặt Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${BLUE}✅ Node.js đã được cài đặt${NC}"
fi

# Install PostgreSQL if not installed
if ! command_exists psql; then
    echo -e "${YELLOW}🗄️ Cài đặt PostgreSQL...${NC}"
    sudo apt install -y postgresql postgresql-contrib
else
    echo -e "${BLUE}✅ PostgreSQL đã được cài đặt${NC}"
fi

# Start and enable PostgreSQL
if ! service_running postgresql; then
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo -e "${GREEN}✅ PostgreSQL đã được khởi động${NC}"
else
    echo -e "${BLUE}✅ PostgreSQL đang chạy${NC}"
fi

# Install Nginx if not installed
if ! command_exists nginx; then
    echo -e "${YELLOW}🌐 Cài đặt Nginx...${NC}"
    sudo apt install -y nginx
else
    echo -e "${BLUE}✅ Nginx đã được cài đặt${NC}"
fi

# Install PM2 if not installed
if ! command_exists pm2; then
    echo -e "${YELLOW}⚙️ Cài đặt PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${BLUE}✅ PM2 đã được cài đặt${NC}"
fi

# Install Certbot if not installed
if ! command_exists certbot; then
    echo -e "${YELLOW}🔒 Cài đặt Certbot cho SSL...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
else
    echo -e "${BLUE}✅ Certbot đã được cài đặt${NC}"
fi

# Setup firewall
echo -e "${YELLOW}🔥 Cấu hình firewall...${NC}"
sudo ufw --force enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# Create application directory
echo -e "${YELLOW}📁 Tạo thư mục ứng dụng...${NC}"
sudo mkdir -p /var/www/ims-server
sudo chown -R $USER:$USER /var/www/ims-server

# Clone or update repository
cd /var/www/ims-server
if [ -d ".git" ]; then
    echo -e "${YELLOW}🔄 Cập nhật repository...${NC}"
    git pull origin main
else
    echo -e "${YELLOW}📥 Clone repository...${NC}"
    git clone https://github.com/dat-nglt/ims-server.git .
fi

# Install dependencies
echo -e "${YELLOW}📦 Cài đặt dependencies...${NC}"
npm install

# Build application
echo -e "${YELLOW}🔨 Build ứng dụng...${NC}"
npm run build

# Setup PostgreSQL database
echo -e "${YELLOW}🗄️ Thiết lập cơ sở dữ liệu PostgreSQL...${NC}"

# Check if database user exists
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='ims_user'" | grep -q 1; then
    sudo -u postgres psql -c "CREATE USER ims_user WITH PASSWORD 'change_this_password';"
    echo -e "${GREEN}✅ Đã tạo user ims_user${NC}"
else
    echo -e "${BLUE}✅ User ims_user đã tồn tại${NC}"
fi

# Check if database exists
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ims_db; then
    sudo -u postgres psql -c "CREATE DATABASE ims_db OWNER ims_user;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ims_db TO ims_user;"
    echo -e "${GREEN}✅ Đã tạo database ims_db${NC}"
else
    echo -e "${BLUE}✅ Database ims_db đã tồn tại${NC}"
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Tạo file môi trường...${NC}"
    cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ims_db
DB_USER=ims_user
DB_PASSWORD=change_this_password
# Thêm các biến môi trường khác nếu cần
EOF
    echo -e "${GREEN}✅ Đã tạo file .env${NC}"
else
    echo -e "${BLUE}✅ File .env đã tồn tại${NC}"
fi

# Run database migrations
echo -e "${YELLOW}🗃️ Chạy database migrations...${NC}"
npm run db:migrate

# Seed database
echo -e "${YELLOW}🌱 Seed database...${NC}"
npm run db:seed || echo -e "${YELLOW}⚠️ Seed có thể đã chạy trước đó${NC}"

# Start application with PM2
echo -e "${YELLOW}🚀 Khởi động ứng dụng với PM2...${NC}"
pm2 describe ims-server > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 restart ims-server
    echo -e "${GREEN}✅ Đã restart ứng dụng${NC}"
else
    pm2 start npm --name "ims-server" -- start
    pm2 save
    pm2 startup
    echo -e "${GREEN}✅ Đã khởi động ứng dụng mới${NC}"
fi

# Configure Nginx
echo -e "${YELLOW}🌐 Cấu hình Nginx...${NC}"
sudo tee /etc/nginx/sites-available/videcoder.io.vn > /dev/null <<EOF
server {
    listen 80;
    server_name videcoder.io.vn www.videcoder.io.vn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Enable site
if [ ! -L "/etc/nginx/sites-enabled/videcoder.io.vn" ]; then
    sudo ln -s /etc/nginx/sites-available/videcoder.io.vn /etc/nginx/sites-enabled/
fi

# Remove default nginx site if exists
if [ -L "/etc/nginx/sites-enabled/default" ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx đã được cấu hình${NC}"

# Setup SSL with Certbot (only if not already configured)
if ! sudo certbot certificates | grep -q "videcoder.io.vn"; then
    echo -e "${YELLOW}🔒 Thiết lập SSL certificate...${NC}"
    # Note: Replace with your actual email
    sudo certbot --nginx -d videcoder.io.vn -d www.videcoder.io.vn --non-interactive --agree-tos --email admin@videcoder.io.vn || echo -e "${YELLOW}⚠️ SSL setup failed. Please run manually: sudo certbot --nginx -d videcoder.io.vn -d www.videcoder.io.vn${NC}"
else
    echo -e "${BLUE}✅ SSL certificate đã được cấu hình${NC}"
fi

# Final message
echo -e "${GREEN}🎉 Cài đặt hoàn thành thành công!${NC}"
echo -e "${GREEN}🌐 Ứng dụng đang chạy tại: https://videcoder.io.vn${NC}"
echo -e "${GREEN}🔍 Health check: https://videcoder.io.vn/health${NC}"
echo -e "${YELLOW}📋 Những việc cần làm tiếp theo:${NC}"
echo -e "1. Cập nhật password database trong file /var/www/ims-server/.env"
echo -e "2. Đảm bảo DNS domain videcoder.io.vn trỏ về IP: 14.225.218.37"
echo -e "3. Cập nhật email trong lệnh certbot nếu cần"
echo -e "4. Kiểm tra logs: pm2 logs ims-server"
echo -e "5. Cấu hình GitHub Actions secrets để enable auto-deployment"