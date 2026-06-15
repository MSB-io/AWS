#!/bin/bash
set -e

REGION="ap-south-1"
KEY_NAME="fanengage-key"
STACK_NAME="FanEngage-App-Stack"

echo "=== FanEngage AWS Teardown Script ==="

echo "Deleting CloudFormation stack: $STACK_NAME..."
aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$REGION"

echo "Waiting for stack deletion to complete..."
aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$REGION"
echo "Stack deleted successfully."

if aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$REGION" > /dev/null 2>&1; then
    echo "Deleting EC2 Key Pair ($KEY_NAME)..."
    aws ec2 delete-key-pair --key-name "$KEY_NAME" --region "$REGION"
    rm -f "$KEY_NAME.pem"
    echo "Key Pair deleted."
fi

echo "=== Teardown Complete! ==="
echo "All AWS resources created for the case study have been successfully destroyed to prevent any charges."
