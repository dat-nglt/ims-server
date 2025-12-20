# 📋 Attendance API - Complete Guide

## 📌 Tổng Quan

Hệ thống API chấm công (Attendance) đã được tối ưu hoá với các tính năng mới:
- ✅ **Multi-Technician Support** - Hỗ trợ nhiều kỹ thuật viên check-in cùng lúc
- ✅ **Attendance Sessions** - Quản lý phiên chấm công (open/closed)
- ✅ **Attendance Types** - Quản lý các loại chấm công
- ✅ **Location Tracking** - Theo dõi vị trí kỹ thuật viên
- ✅ **Attendance Reports** - Báo cáo và thống kê chấm công

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (Web/Mobile)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│                  ROUTES (attendance.route.js)           │
│  - Check-in/Out, Sessions, Types, Locations, Reports   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│             CONTROLLERS (attendance.controller.js)      │
│  - Request validation & response formatting            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│              SERVICES (attendance.service.js)           │
│  - Business logic, data processing, validations        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│                  MODELS & DATABASE                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ - attendance                                      │   │
│  │ - attendance_sessions                            │   │
│  │ - attendance_session_histories                    │   │
│  │ - attendance_type                                │   │
│  │ - users, works, projects                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📂 File Structure

```
ims-server/
├── src/
│   ├── models/
│   │   └── operations/
│   │       ├── attendance.model.js
│   │       ├── attendanceSession.model.js
│   │       ├── attendanceSessionHistory.model.js
│   │       └── attendance-type.model.js
│   ├── controllers/
│   │   └── operations/
│   │       └── attendance.controller.js (523 lines)
│   ├── services/
│   │   └── operations/
│   │       └── attendance.service.js (753 lines)
│   └── routes/
│       └── operations/
│           └── attendance.route.js (130 lines)
├── docs/
│   ├── attendance-api.md (Complete API Reference)
│   └── ims-attendance.postman_collection.json
├── examples/
│   └── attendance-api-examples.sh
└── CHANGELOG-ATTENDANCE.md
```

## 🔄 Core Business Logic

### 1. Check-in Flow

```javascript
// Step 1: User sends check-in request
POST /attendance/check-in
{
  "user_id": 1,
  "work_id": 10,
  "latitude": 21.0285,
  "longitude": 105.8542,
  "technicians": [1, 2, 3]  // Multi-technician support
}

// Step 2: Service validates
✓ User exists
✓ Work exists
✓ Project exists (if provided)
✓ CheckInType exists (if provided)
✓ User doesn't have active session

// Step 3: Create Attendance record
attendance {
  user_id: 1,
  work_id: 10,
  check_in_time: 2025-12-20T08:00:00Z,
  status: 'checked_in',
  technicians: [1, 2, 3]
}

// Step 4: Model hook triggers
beforeCreate → Create AttendanceSession
afterCreate  → Create child records for user 2, 3
              → Record history

// Response
{
  "status": "success",
  "data": { Attendance record },
  "sessionId": 45
}
```

### 2. Check-out Flow (Option 1: By Attendance ID)

```javascript
POST /attendance/check-out

// Service updates Attendance
{
  check_out_time: 2025-12-20T17:00:00Z,
  status: 'checked_out',
  duration_minutes: 540
}
```

### 3. Check-out Flow (Option 2: By Session)

```javascript
POST /attendance/sessions/:sessionId/check-out

// Service updates Session
{
  ended_at: 2025-12-20T17:00:00Z,
  status: 'closed'
}

// Model hook afterUpdate triggers:
// 1. Update ALL attendance records (primary + children)
// 2. Record history to AttendanceSessionHistory
// 3. Delete session from attendance_sessions
```

### 4. Multi-Technician Handling

```javascript
// Input: 3 technicians
checkInData = {
  user_id: 1,
  technicians: [1, 2, 3]
}

// After check-in, database contains:
attendance #1 { user_id: 1, parent_attendance_id: null }
attendance #2 { user_id: 2, parent_attendance_id: 1 }
attendance #3 { user_id: 3, parent_attendance_id: 1 }
// All share the same attendance_session_id

// When check-out session:
// All 3 records get updated + deleted session
```

## 🛣️ API Endpoints Reference

### Check-in/Check-out
```
POST   /attendance/check-in                    # Check-in user(s)
POST   /attendance/check-out              # Check-out by attendance (id in body)
GET    /attendance                            # Get all attendance
GET    /attendance/:id                        # Get by ID
GET    /attendance/user/:userId               # Get user history
```

### Attendance Sessions
```
GET    /attendance/sessions/all               # Get all sessions
GET    /attendance/sessions/:id               # Get session by ID
GET    /attendance/sessions/user/:userId/active      # Get active session
GET    /attendance/sessions/closed            # Get closed sessions
POST   /attendance/sessions/:sessionId/check-out    # Check-out from session
```

### Attendance Types
```
GET    /attendance/types                      # Get all types
GET    /attendance/types/:id                  # Get type by ID
POST   /attendance/types                      # Create type
PUT    /attendance/types/:id                  # Update type
DELETE /attendance/types/:id                  # Delete type (soft)
```

### Locations
```
GET    /attendance/locations/technicians      # Get tech locations
GET    /attendance/locations/office           # Get office location
GET    /attendance/locations/technicians/:id/history   # Location history
GET    /attendance/locations/job-items        # Get job locations
GET    /attendance/locations/geocoding/reverse         # Reverse geocoding
```

### Reports
```
GET    /attendance/reports/summary            # Attendance summary
GET    /attendance/reports/statistics         # Attendance stats
```

## 📊 Database Schema

### Attendance
```sql
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL (FK users),
  work_id INT (FK works),
  project_id INT (FK projects),
  attendance_session_id INT (FK attendance_sessions),
  parent_attendance_id INT (FK attendance),
  check_in_time DATETIME NOT NULL,
  check_out_time DATETIME,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  location_name VARCHAR(255),
  address TEXT,
  photo_urls TEXT,
  status ENUM('checked_in','checked_out','on_leave'),
  distance_from_work DECIMAL(10,2),
  is_within_radius BOOLEAN,
  duration_minutes INT,
  device_info TEXT,
  ip_address VARCHAR(45),
  notes TEXT,
  check_in_type_id INT (FK attendance_type),
  violation_distance DECIMAL(10,2),
  technicians JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### AttendanceSession
```sql
CREATE TABLE attendance_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL (FK users),
  work_id INT (FK works),
  project_id INT (FK projects),
  started_at DATETIME,
  ended_at DATETIME,
  status ENUM('open','closed'),
  duration_minutes INT,
  check_in_id INT (FK attendance),
  check_out_id INT (FK attendance),
  notes TEXT,
  metadata JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### AttendanceSessionHistory
```sql
CREATE TABLE attendance_session_histories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  original_id INT,
  user_id INT (FK users),
  work_id INT (FK works),
  project_id INT (FK projects),
  started_at DATETIME,
  ended_at DATETIME,
  status VARCHAR(20),
  duration_minutes INT,
  check_in_id INT,
  check_out_id INT,
  attendee_user_ids JSON,
  notes TEXT,
  metadata JSON,
  archived_at DATETIME NOT NULL,
  archived_by INT
);
```

### CheckInType
```sql
CREATE TABLE attendance_type (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  default_duration_minutes INT,
  start_time TIME,
  end_time TIME,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME,
  updated_at DATETIME
);
```

## 🧪 Testing Guide

### 1. Setup Postman
```bash
1. Open Postman
2. File → Import → Select `docs/ims-attendance.postman_collection.json`
3. Set base_url variable to http://localhost:3000/api
4. Start testing endpoints
```

### 2. Run cURL Examples
```bash
bash examples/attendance-api-examples.sh
```

### 3. Test Multi-Technician Workflow
```bash
# 1. Check-in 3 people
curl -X POST http://localhost:3000/api/attendance/check-in \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"work_id":10,"latitude":21.0285,"longitude":105.8542,"technicians":[1,2,3]}'

# Response: sessionId = 45

# 2. Verify 3 attendance records created
curl http://localhost:3000/api/attendance/sessions/45

# 3. Check-out (updates all 3)
curl -X POST http://localhost:3000/api/attendance/sessions/45/check-out

# 4. Verify deleted
curl http://localhost:3000/api/attendance/sessions/45
```

## 🔐 Security Considerations

- ✅ Input validation on all endpoints
- ✅ Foreign key validation
- ✅ Transaction support for multi-step operations
- ✅ Soft delete for attendance types (not hard delete)
- ✅ Historical tracking (AttendanceSessionHistory)
- ⚠️ TODO: Add authentication/authorization middleware
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add request logging

## 🚀 Performance Optimization

### Database Indexes
```sql
-- Attendance
CREATE INDEX idx_attendance_user_time ON attendance(user_id, check_in_time);
CREATE INDEX idx_attendance_work_time ON attendance(work_id, check_in_time);
CREATE INDEX idx_attendance_project_time ON attendance(project_id, check_in_time);

-- AttendanceSession
CREATE INDEX idx_session_user ON attendance_sessions(user_id);
CREATE INDEX idx_session_status ON attendance_sessions(status);

-- AttendanceType
CREATE INDEX idx_type_code ON attendance_type(code);
CREATE INDEX idx_type_active ON attendance_type(active);
```

### Query Optimization
- ✅ Use `include` for related models only when needed
- ✅ Use `attributes` to select specific columns
- ✅ Use pagination for large result sets
- ✅ Cache location data (technicians, office)

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `src/docs/attendance-api.md` | Complete API reference with examples |
| `CHANGELOG-ATTENDANCE.md` | Detailed change log |
| `docs/ims-attendance.postman_collection.json` | Postman collection |
| `examples/attendance-api-examples.sh` | cURL examples |

## 🔧 Configuration

### Environment Variables
```bash
# database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ims
DB_USER=postgres
DB_PASSWORD=...

# API
API_PORT=3000
API_BASE_URL=/api

# Logging
LOG_LEVEL=info
```

## 🐛 Known Issues & TODO

- [ ] Add authentication middleware
- [ ] Add request validation middleware
- [ ] Add rate limiting
- [ ] Add comprehensive error handling
- [ ] Add request/response logging
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add pagination to list endpoints
- [ ] Add search filters to attendance query
- [ ] Add bulk operations

## 📞 Support & Contact

For questions or issues:
1. Check `src/docs/attendance-api.md`
2. Review test examples in `examples/`
3. Check Postman collection for endpoint details

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-20 | Initial release with full multi-technician support |

---

**Last Updated:** 2025-12-20  
**Status:** ✅ Complete & Ready for Testing
