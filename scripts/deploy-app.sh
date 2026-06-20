#!/bin/bash
# deploy-app.sh — Zero-touch automated deployment to EC2
set -e

STACK_NAME="FanEngage-App-Stack"
REGION="ap-south-1"
KEY_FILE="fanengage-key.pem"

echo "=== Starting FanEngage AWS App Deployment ==="

# 1. Fetch outputs from CloudFormation
echo "Retrieving EC2 Public IP and RDS Endpoint from AWS..."
EC2_IP=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='WebServerPublicIP'].OutputValue" \
    --output text)

RDS_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
    --output text)

echo "EC2 IP       : $EC2_IP"
echo "RDS Endpoint : $RDS_ENDPOINT"

# 2. Update docker-compose.prod.yml DB_HOST dynamically
echo "Configuring RDS database endpoint in docker-compose.prod.yml..."
sed -i '' "s/DB_HOST:.*/DB_HOST: $RDS_ENDPOINT/" docker-compose.prod.yml

# 3. Create app package
echo "Packaging application code (ignoring node_modules)..."
tar --exclude='node_modules' --exclude='.git' --exclude='*.pem' --exclude='app.tar.gz' -czf app.tar.gz .

# 4. Transfer package to EC2
echo "Uploading application package to EC2 host ($EC2_IP)..."
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no app.tar.gz ubuntu@$EC2_IP:/home/ubuntu/

# 5. Remote Execution via SSH
echo "Executing setup and start commands on EC2 host..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'EOF'
  set -e
  echo "[Remote] Unpacking application codebase..."
  tar -xzf app.tar.gz
  chmod +x scripts/*.sh

  echo "[Remote] Running system bootstrap script setup-server.sh..."
  sudo bash scripts/setup-server.sh

  echo "[Remote] Deploying multi-container environment via Docker Compose..."
  # Run docker-compose with sudo since Docker requires privileges
  sudo docker-compose -f docker-compose.prod.yml up --build -d

  echo "[Remote] Verification of running containers..."
  sudo docker-compose ps
EOF

echo "=== Deployment Successfully Completed! ==="
echo "Access the live FanEngage portal at: http://$EC2_IP"
