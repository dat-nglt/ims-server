#!/bin/bash

# Script for PostgreSQL operations on VPS
# This script demonstrates common psql commands for database management

# Variables (replace with your actual values)
VPS_HOST="your-vps-ip-or-domain"
VPS_USER="your-ssh-username"
DB_USER="your-db-username"
DB_NAME="your-database-name"
DB_PASSWORD="your-db-password"  # Consider using environment variables or .pgpass for security

# Function to execute psql commands on VPS via SSH
execute_psql() {
    local sql_command="$1"
    ssh $VPS_USER@$VPS_HOST "PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c \"$sql_command\""
}

echo "Starting PostgreSQL operations on VPS..."

# 1. Create a new database
echo "Creating database..."
execute_psql "CREATE DATABASE IF NOT EXISTS test_db;"

# 2. Create a table
echo "Creating table..."
execute_psql "CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# 3. Insert sample data
echo "Inserting sample data..."
execute_psql "INSERT INTO users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Johnson', 'bob@example.com');"

# 4. Query data
echo "Querying data..."
ssh $VPS_USER@$VPS_HOST "PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c 'SELECT * FROM users;'"

# 5. Update data
echo "Updating data..."
execute_psql "UPDATE users SET name = 'John Updated' WHERE id = 1;"

# 6. Delete data
echo "Deleting data..."
execute_psql "DELETE FROM users WHERE id = 3;"

# 7. Backup database
echo "Creating database backup..."
ssh $VPS_USER@$VPS_HOST "PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U $DB_USER $DB_NAME > /path/to/backup.sql"

# 8. Restore database (uncomment and modify as needed)
# echo "Restoring database..."
# ssh $VPS_USER@$VPS_HOST "PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME < /path/to/backup.sql"

# 9. Show database size
echo "Checking database size..."
execute_psql "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));"

# 10. List all tables
echo "Listing all tables..."
execute_psql "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"

echo "PostgreSQL operations completed."