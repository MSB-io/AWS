#!/bin/bash
# setup-server.sh — Bootstrap EC2 Ubuntu 22.04 instance
# Run once after EC2 launch via SSH

set -e
echo "=== FanEngage EC2 Setup Script ==="

# Update system
echo "[1/8] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# Install Node.js 20
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
echo "[3/8] Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Docker
echo "[4/8] Installing Docker..."
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
sudo systemctl enable docker

# Install MySQL client (for backups)
echo "[5/8] Installing MySQL client..."
sudo apt-get install -y mysql-client

# Install AWS CLI
echo "[6/8] Installing AWS CLI..."
sudo apt-get install -y awscli

# Install PM2 (process manager for Node)
echo "[7/8] Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Setup UFW firewall
echo "[8/8] Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5001/tcp
sudo ufw --force enable

echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Clone repo: git clone <your-repo> /home/ubuntu/fanengage"
echo "  2. Run: cd /home/ubuntu/fanengage && npm install"
echo "  3. Set environment variables in /home/ubuntu/fanengage/backend/.env"
echo "  4. Start with PM2: pm2 start backend/src/app.js --name fanengage-api"
