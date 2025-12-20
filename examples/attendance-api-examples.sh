#!/bin/bash

# Attendance API - cURL Examples
# Base URL: http://localhost:3000/api/attendance

BASE_URL="http://localhost:3000/api/attendance"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ATTENDANCE API - cURL Examples ===${NC}\n"

# ==================== CHECK-IN/CHECK-OUT ====================

echo -e "${BLUE}### 1. CHECK-IN PERSON ###${NC}\n"
echo "# Basic check-in"
curl -X POST "$BASE_URL/check-in" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "work_id": 10,
    "project_id": 5,
    "latitude": 21.0285,
    "longitude": 105.8542,
    "location_name": "Hanoi Office",
    "address": "123 Le Loi St",
    "photo_urls": "https://example.com/photo.jpg",
    "device_info": "iPhone 13",
    "ip_address": "192.168.1.1",
    "notes": "Check-in for project A",
    "check_in_type_id": 1,
    "violation_distance": 0,
    "technicians": [1]
  }' | jq .

echo -e "\n# Multi-technician check-in"
curl -X POST "$BASE_URL/check-in" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "work_id": 10,
    "latitude": 21.0285,
    "longitude": 105.8542,
    "location_name": "Site A",
    "technicians": [1, 2, 3]
  }' | jq .

echo -e "\n${BLUE}### 2. CHECK-OUT BY ATTENDANCE ID ###${NC}\n"
echo "# Check-out by attendance record (replace :id with actual ID)"
curl -X POST "$BASE_URL/1/check-out" \
  -H "Content-Type: application/json" | jq .

echo -e "\n${BLUE}### 3. GET ATTENDANCE INFO ###${NC}\n"
echo "# Get all attendance records"
curl -X GET "$BASE_URL" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get attendance by ID"
curl -X GET "$BASE_URL/1" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get attendance history for user"
curl -X GET "$BASE_URL/user/1" \
  -H "Content-Type: application/json" | jq .

# ==================== ATTENDANCE SESSIONS ====================

echo -e "\n${BLUE}### 4. ATTENDANCE SESSION MANAGEMENT ###${NC}\n"
echo "# Get all sessions"
curl -X GET "$BASE_URL/sessions/all" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get active session for user"
curl -X GET "$BASE_URL/sessions/user/1/active" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get session details (replace :id with actual ID)"
curl -X GET "$BASE_URL/sessions/1" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get closed sessions in date range"
curl -X GET "$BASE_URL/sessions/closed?start_date=2025-12-01&end_date=2025-12-31&user_id=1" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Check-out from session (replace :sessionId with actual ID)"
curl -X POST "$BASE_URL/sessions/1/check-out" \
  -H "Content-Type: application/json" | jq .

# ==================== ATTENDANCE TYPES ====================

echo -e "\n${BLUE}### 5. ATTENDANCE TYPE MANAGEMENT ###${NC}\n"
echo "# Get all attendance types"
curl -X GET "$BASE_URL/types" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get attendance type by ID"
curl -X GET "$BASE_URL/types/1" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Create attendance type"
curl -X POST "$BASE_URL/types" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "OT",
    "name": "Overtime",
    "default_duration_minutes": 240,
    "start_time": "18:00:00",
    "end_time": "22:00:00",
    "description": "Overtime work"
  }' | jq .

echo -e "\n# Update attendance type (replace :id with actual ID)"
curl -X PUT "$BASE_URL/types/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Overtime",
    "description": "Updated description",
    "active": true
  }' | jq .

echo -e "\n# Delete attendance type (replace :id with actual ID)"
curl -X DELETE "$BASE_URL/types/1" \
  -H "Content-Type: application/json" | jq .

# ==================== LOCATIONS ====================

echo -e "\n${BLUE}### 6. LOCATION TRACKING ###${NC}\n"
echo "# Get technicians locations (online only)"
curl -X GET "$BASE_URL/locations/technicians?includeOffline=false" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get office location"
curl -X GET "$BASE_URL/locations/office" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get technician location history"
curl -X GET "$BASE_URL/locations/technicians/1/history?startDate=2025-12-01&endDate=2025-12-31&limit=50" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get job locations"
curl -X GET "$BASE_URL/locations/job-items?status=in_progress&includeArchived=false" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Reverse geocoding"
curl -X GET "$BASE_URL/locations/geocoding/reverse?lat=21.0285&lng=105.8542&language=vi" \
  -H "Content-Type: application/json" | jq .

# ==================== REPORTS ====================

echo -e "\n${BLUE}### 7. ATTENDANCE REPORTS ###${NC}\n"
echo "# Get attendance summary"
curl -X GET "$BASE_URL/reports/summary?start_date=2025-12-01&end_date=2025-12-31&department_id=1&employee_id=1" \
  -H "Content-Type: application/json" | jq .

echo -e "\n# Get attendance statistics"
curl -X GET "$BASE_URL/reports/statistics?start_date=2025-12-01&end_date=2025-12-31&department_id=1" \
  -H "Content-Type: application/json" | jq .

# ==================== SAMPLE WORKFLOW ====================

echo -e "\n${BLUE}### SAMPLE WORKFLOW: MULTI-TECHNICIAN CHECK-IN/OUT ###${NC}\n"

echo "Step 1: Create attendance type (Overtime)"
TYPE_RESPONSE=$(curl -s -X POST "$BASE_URL/types" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "OT",
    "name": "Overtime",
    "start_time": "18:00:00",
    "end_time": "22:00:00"
  }')
echo "$TYPE_RESPONSE" | jq .

echo -e "\n${GREEN}Step 2: Multi-technician check-in (3 people)${NC}"
CHECKIN_RESPONSE=$(curl -s -X POST "$BASE_URL/check-in" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "work_id": 10,
    "project_id": 5,
    "latitude": 21.0285,
    "longitude": 105.8542,
    "location_name": "Project Site",
    "check_in_type_id": 1,
    "technicians": [1, 2, 3]
  }')
echo "$CHECKIN_RESPONSE" | jq .

# Extract sessionId for next step
SESSION_ID=$(echo "$CHECKIN_RESPONSE" | jq -r '.sessionId')
echo "Session ID: $SESSION_ID"

echo -e "\n${GREEN}Step 3: Get session details (verify 3 attendance records)${NC}"
curl -s -X GET "$BASE_URL/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" | jq .

echo -e "\n${GREEN}Step 4: Check-out from session (all 3 people)${NC}"
curl -s -X POST "$BASE_URL/sessions/$SESSION_ID/check-out" \
  -H "Content-Type: application/json" | jq .

echo -e "\n${GREEN}Step 5: Verify session is closed (should be deleted)${NC}"
curl -s -X GET "$BASE_URL/sessions/$SESSION_ID" \
  -H "Content-Type: application/json" | jq .

echo -e "\n${BLUE}Workflow completed!${NC}\n"
