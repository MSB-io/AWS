#!/bin/bash
# monitor.sh — Push CPU/Memory metrics to CloudWatch
# Cron: */5 * * * * /home/ubuntu/scripts/monitor.sh

INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
REGION="us-east-1"
NAMESPACE="FanEngage/System"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# CPU utilization
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# Memory utilization
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_PCT=$(echo "scale=1; $MEM_USED * 100 / $MEM_TOTAL" | bc)

# Disk utilization
DISK_PCT=$(df / | tail -1 | awk '{print $5}' | tr -d '%')

echo "[$(date)] Metrics: CPU=${CPU}% MEM=${MEM_PCT}% DISK=${DISK_PCT}%"

# Push to CloudWatch
aws cloudwatch put-metric-data \
  --metric-name CPUUtilization \
  --namespace "$NAMESPACE" \
  --value "$CPU" \
  --unit Percent \
  --region "$REGION"

aws cloudwatch put-metric-data \
  --metric-name MemoryUtilization \
  --namespace "$NAMESPACE" \
  --value "$MEM_PCT" \
  --unit Percent \
  --region "$REGION"

aws cloudwatch put-metric-data \
  --metric-name DiskUtilization \
  --namespace "$NAMESPACE" \
  --value "$DISK_PCT" \
  --unit Percent \
  --region "$REGION"

echo "[$(date)] Metrics pushed to CloudWatch namespace: $NAMESPACE"
