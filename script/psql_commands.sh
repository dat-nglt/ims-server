#!/bin/bash

# Script to restore database from ims_db_backup.sql
# This script restores the database from the backup file

# Variables (replace with your actual values or load from .env)
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="ims_root"
DB_PASSWORD="khonggilatuyetdoiBAOMAT2025"
DB_NAME="ims_db"

# Path to backup file (relative to script directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_FILE="$SCRIPT_DIR/ims_db_backup.sql"

# Function to execute psql commands
execute_psql() {
    local sql_command="$1"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$sql_command"
}

echo "Starting database restore from $BACKUP_FILE..."

# Check if backup file exists
if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "Error: Backup file $BACKUP_FILE not found."
    exit 1
fi

# Optional: Drop and recreate database if needed (uncomment if required)
# echo "Dropping and recreating database..."
# PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
# PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

# Restore from backup
echo "Restoring database from backup file..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

echo "Database restore completed successfully."