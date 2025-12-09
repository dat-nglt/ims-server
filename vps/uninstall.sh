#!/bin/bash

# VPS Auto Uninstallation Script for IMS Server
# This script removes all components installed by the install.sh script
# Script này có thể chạy nhiều lần an toàn (idempotent)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}🗑️ Bắt đầu gỡ bỏ VPS tự động cho IMS Server...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if service is running
service_running() {
    sudo systemctl is-active --quiet "$1" 2>/dev/null
}

# Function to check if package is installed
package_installed() {
    dpkg -l "$1" >/dev/null 2>&1
}

# Stop and remove PM2 application
echo -e "${YELLOW}🛑 Dừng và xóa ứng dụng PM2...${NC}"
if pm2 describe ims-server >/dev/null 2>&1; then
    pm2 stop ims-server
    pm2 delete ims-server
    pm2 save
    echo -e "${GREEN}✅ Đã dừng và xóa ứng dụng PM2${NC}"
else
    echo -e "${BLUE}ℹ️ Ứng dụng PM2 không tồn tại${NC}"
fi

# Remove Nginx configuration
echo -e "${YELLOW}🌐 Xóa cấu hình Nginx...${NC}"
if [ -f "/etc/nginx/sites-available/lamquangdai.vn" ]; then
    sudo rm -f /etc/nginx/sites-enabled/lamquangdai.vn
    sudo rm -f /etc/nginx/sites-available/lamquangdai.vn
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Đã xóa cấu hình Nginx${NC}"
else
    echo -e "${BLUE}ℹ️ Cấu hình Nginx không tồn tại${NC}"
fi

# Remove SSL certificates
echo -e "${YELLOW}🔒 Xóa SSL certificates...${NC}"
if sudo certbot certificates | grep -q "lamquangdai.vn"; then
    sudo certbot delete --cert-name lamquangdai.vn --non-interactive || echo -e "${YELLOW}⚠️ Không thể xóa certificate tự động, hãy xóa thủ công${NC}"
    echo -e "${GREEN}✅ Đã xóa SSL certificates${NC}"
else
    echo -e "${BLUE}ℹ️ SSL certificates không tồn tại${NC}"
fi

# Remove PostgreSQL database and user
echo -e "${YELLOW}🗄️ Xóa cơ sở dữ liệu PostgreSQL...${NC}"
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw ims_db; then
    sudo -u postgres psql -c "DROP DATABASE IF EXISTS ims_db;" || echo -e "${YELLOW}⚠️ Không thể xóa database${NC}"
    echo -e "${GREEN}✅ Đã xóa database ims_db${NC}"
else
    echo -e "${BLUE}ℹ️ Database ims_db không tồn tại${NC}"
fi

if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='ims_root'" | grep -q 1; then
    sudo -u postgres psql -c "DROP USER IF EXISTS ims_root;" || echo -e "${YELLOW}⚠️ Không thể xóa user${NC}"
    echo -e "${GREEN}✅ Đã xóa user ims_root${NC}"
else
    echo -e "${BLUE}ℹ️ User ims_root không tồn tại${NC}"
fi

# Remove application directory
echo -e "${YELLOW}📁 Xóa thư mục ứng dụng...${NC}"
if [ -d "/var/www/ims-server" ]; then
    sudo rm -rf /var/www/ims-server
    echo -e "${GREEN}✅ Đã xóa thư mục ứng dụng${NC}"
else
    echo -e "${BLUE}ℹ️ Thư mục ứng dụng không tồn tại${NC}"
fi

# Reset firewall to default (optional - comment out if you want to keep custom rules)
echo -e "${YELLOW}🔥 Reset firewall về mặc định...${NC}"
sudo ufw --force reset
sudo ufw --force enable
sudo ufw allow OpenSSH
echo -e "${GREEN}✅ Đã reset firewall${NC}"

# Optional: Remove installed packages (uncomment if you want to remove them)
# Note: Be careful as these might be used by other applications
echo -e "${YELLOW}📦 Các gói đã cài đặt sẽ được giữ lại để tránh ảnh hưởng đến hệ thống khác${NC}"
echo -e "${YELLOW}Nếu muốn gỡ bỏ, hãy uncomment các dòng sau:${NC}"
# echo -e "${YELLOW}🗑️ Gỡ bỏ các gói đã cài đặt...${NC}"
# if package_installed nodejs; then sudo apt remove -y nodejs; fi
# if package_installed postgresql; then sudo apt remove -y postgresql postgresql-contrib; fi
# if package_installed nginx; then sudo apt remove -y nginx; fi
# if command_exists pm2; then sudo npm uninstall -g pm2; fi
# if package_installed certbot; then sudo apt remove -y certbot python3-certbot-nginx; fi
# sudo apt autoremove -y
# echo -e "${GREEN}✅ Đã gỡ bỏ các gói${NC}"

# Final message
echo -e "${GREEN}🎉 Gỡ bỏ hoàn thành!${NC}"
echo -e "${YELLOW}📋 Lưu ý:${NC}"
echo -e "1. Nếu muốn gỡ bỏ hoàn toàn các gói phần mềm, hãy uncomment phần gỡ bỏ gói trong script"
echo -e "2. Kiểm tra lại firewall và các dịch vụ còn lại"
echo -e "3. Restart hệ thống nếu cần thiết"