#!/usr/bin/env bash
set -euo pipefail

# Setup script for Ubuntu 24.04 LTS on Jagoan Hosting VPS KVM Nebula (2 vCPU / 2 GB RAM)
# Run as root or with sudo: sudo bash deploy/setup-vps.sh

echo "=== 1. Creating 2GB Swap (wajib untuk VPS 2GB RAM saat next build) ==="
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

echo "=== 2. Updating system & installing essentials ==="
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx

echo "=== 3. Installing Node.js 22 LTS & PM2 ==="
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2

echo "=== 4. Installing PostgreSQL 16 ==="
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

echo "=== 5. Installing & tuning Redis 7 (maxmemory 128mb) ==="
apt install -y redis-server
sed -i 's/^# maxmemory <bytes>/maxmemory 128mb/' /etc/redis/redis.conf || true
sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf || true
systemctl enable redis-server
systemctl restart redis-server

echo "=== 6. Configuring UFW Firewall ==="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "=== Setup Base VPS Selesai! Lanjutkan sesuai deploy/DEPLOY_VPS_GUIDE.md ==="

