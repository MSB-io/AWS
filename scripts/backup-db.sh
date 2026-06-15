#!/bin/bash
# backup-db.sh — Daily MySQL → S3 backup
# Cron: 0 2 * * * /home/ubuntu/scripts/backup-db.sh

set -e

DB_NAME="fanengage_db"
DB_USER="root"
DB_PASSWORD="root"
DB_HOST="localhost"
S3_BUCKET="s3://fanengage-backups"
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="fanengage_backup_${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting MySQL backup..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" | gzip > "$BACKUP_DIR/$FILENAME"

echo "[$(date)] Uploading $FILENAME to S3..."
aws s3 cp "$BACKUP_DIR/$FILENAME" "$S3_BUCKET/db-backups/$FILENAME"

# Keep only last 7 local backups
ls -t "$BACKUP_DIR"/*.sql.gz | tail -n +8 | xargs -r rm

echo "[$(date)] Backup complete: $FILENAME"
