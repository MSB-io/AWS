#!/bin/bash
set -e

REGION="ap-south-1"
KEY_NAME="fanengage-key"
STACK_NAME="FanEngage-App-Stack"

echo "=== FanEngage AWS Provisioning Script ==="

# 1. Create SSH Key Pair if it doesn't exist
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "Creating EC2 Key Pair ($KEY_NAME)..."
    aws ec2 create-key-pair \
        --key-name "$KEY_NAME" \
        --region "$REGION" \
        --query 'KeyMaterial' \
        --output text > "$KEY_NAME.pem"
    chmod 400 "$KEY_NAME.pem"
    echo "Key Pair saved to $KEY_NAME.pem"
else
    echo "Key Pair ($KEY_NAME) already exists in $REGION."
fi

# 2. Deploy CloudFormation Stack
echo "Deploying AWS infrastructure via CloudFormation..."
aws cloudformation deploy \
    --template-file scripts/cloudformation.yml \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --parameter-overrides KeyName="$KEY_NAME" \
    --capabilities CAPABILITY_IAM

echo "=== Provisioning Complete! ==="

# 3. Retrieve Outputs
echo "Retrieving outputs..."
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

echo "---------------------------------------------------"
echo "EC2 Public IP: $EC2_IP"
echo "RDS Endpoint : $RDS_ENDPOINT"
echo "---------------------------------------------------"

echo "To connect to your server run:"
echo "ssh -i $KEY_NAME.pem ubuntu@$EC2_IP"
echo ""
echo "Next step: copy the project files to the EC2 instance and run setup-server.sh!"
